import { useState, useEffect, useRef } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import { z } from "zod";
import type { Article } from "@/domain/articles/types/Article";
import { useCreateArticle } from "@/domain/articles/hooks/useCreateArticle";
import { useSubmitArticleToReview } from "@/domain/articles/hooks/useSubmitArticleToReview";
import { slugify } from "@/shared/lib/utils";
import { useNavigate, useBlocker } from "@tanstack/react-router";
import { useEditArticle } from "@/domain/articles/hooks/useEditArticle";
import { useQueryClient } from "@tanstack/react-query";

export const articleEditorSchema = z.object({
  title: z.string().min(1, "Título obrigatório"),
  content: z.string().min(1, "Conteúdo obrigatório"),
  tags: z.array(z.string()),
  visibility: z.enum(["public", "students_only"]),
});

export type ArticleActionType = "saveExistingArticle" | "submitArticleToRevision" | "saveToDrafts";

export type ArticleEditorFormOnSubmitParams = {
  value: z.infer<typeof articleEditorSchema>;
  meta: { articleActionType: ArticleActionType };
};

export type useArticleEditorFormProps = {
  articleBeingEdited: Article | null;
  articleId?: string;
};

export function useArticleEditorForm({ articleBeingEdited, articleId }: useArticleEditorFormProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const isSavingRef = useRef(false);

  const queryClient = useQueryClient();

  const createArticle = useCreateArticle();
  const submitForReview = useSubmitArticleToReview();
  const editArticle = useEditArticle();

  const navigate = useNavigate({ from: "/writer/articles/new" });

  const form = useForm({
    defaultValues: {
      title: articleBeingEdited?.title ?? "",
      content: articleBeingEdited?.content ?? "",
      tags: articleBeingEdited?.tags ?? [],
      visibility: articleBeingEdited?.visibility ?? "public",
    },
    validators: {
      onChange: articleEditorSchema,
    },
    onSubmit: async ({ value, meta }: ArticleEditorFormOnSubmitParams) => {
      const { title, content, tags, visibility } = value;
      const { articleActionType } = meta;
      const slug = slugify(title);

      if (articleActionType === "saveToDrafts") {
        const { articleId } = await createArticle.mutateAsync({ content, title, tags, visibility, slug });
        isSavingRef.current = true;
        navigate({ to: "/writer/articles/$articleId/edit", params: { articleId } });
        form.reset({ content, tags, title, visibility });
        isSavingRef.current = false;
      }

      if (articleActionType === "submitArticleToRevision") {
        await submitForReview.mutateAsync({ articleId: articleId ?? "" });
      }

      if (articleActionType === "saveExistingArticle") {
        await editArticle.mutateAsync({ articleId: articleId ?? "", content, title, tags, visibility });
        form.reset({ content, tags, title, visibility });
      }

      queryClient.invalidateQueries({ queryKey: ["account-articles"] });
      queryClient.invalidateQueries({ queryKey: ["article-by-id"] });

      return;
    },
  });

  const isFieldsDirty = useStore(form.store, (state) => state.isDirty);

  useBlocker({
    shouldBlockFn: () => {
      if (!isFieldsDirty || isSavingRef.current) return false;
      const shouldLeave = confirm("Você tem alterações não salvas. Deseja sair mesmo assim?");
      return !shouldLeave;
    },
    enableBeforeUnload: isFieldsDirty,
  });

  // Sync fetched article into form when data loads asynchronously.
  // Uses reset() instead of setFieldValue() so defaultValues are updated — isDirty stays false until user edits.
  // Dep array uses only articleId: re-running on every refetch causes a flash of stale content mid-save.
  useEffect(() => {
    if (articleBeingEdited) {
      form.reset({
        title: articleBeingEdited.title,
        content: articleBeingEdited.content,
        tags: articleBeingEdited.tags,
        visibility: articleBeingEdited.visibility,
      });
    }
  }, [articleBeingEdited?.articleId, articleBeingEdited, form]);

  const handleSubmit = async ({ articleActionType }: { articleActionType: ArticleActionType }) => {
    await form.handleSubmit({ articleActionType });
  };

  return {
    form,
    previewOpen,
    setPreviewOpen,
    handleSubmit,
    currentArticleStatus: articleBeingEdited?.status,
    isSavingArticleToDraft: createArticle.isPending,
    isSubmittingArticle: submitForReview.isPending,
    isSavingExistingArticle: editArticle.isPending,
    isSavingExistingButtonDisabled: !isFieldsDirty || editArticle.isPending,
  };
}
