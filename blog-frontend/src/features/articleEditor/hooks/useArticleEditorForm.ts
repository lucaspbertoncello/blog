import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import type { Article, ArticleVisibility } from "@/domain/articles/types/Article";
import { useCreateArticle } from "@/domain/articles/hooks/useCreateArticle";
import { useSubmitArticleToReview } from "@/domain/articles/hooks/useSubmitArticleToReview";
import { slugify } from "@/shared/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { useEditArticle } from "@/domain/articles/hooks/useEditArticle";

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

  const createArticle = useCreateArticle();
  const submitForReview = useSubmitArticleToReview();
  const editArticle = useEditArticle();

  const navigate = useNavigate({ from: "/writer/articles/new" });

  const form = useForm({
    defaultValues: {
      title: articleBeingEdited?.title ?? "",
      content: articleBeingEdited?.content ?? "",
      tags: articleBeingEdited?.tags ?? ([] as string[]),
      visibility: (articleBeingEdited?.visibility ?? "public") as ArticleVisibility,
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
        navigate({ to: "/writer/articles/$articleId/edit", params: { articleId } });
      }

      if (articleActionType === "submitArticleToRevision") {
        await submitForReview.mutateAsync({ articleId: articleId ?? "" });
      }

      if (articleActionType === "saveExistingArticle") {
        await editArticle.mutateAsync({ articleId: articleId ?? "", content, title, tags, visibility });
      }

      return;
    },
  });

  const handleSubmit = async ({ articleActionType }: { articleActionType: ArticleActionType }) => {
    await form.handleSubmit({ articleActionType });
  };

  return {
    form,
    previewOpen,
    setPreviewOpen,
    handleSubmit,
    isSavingArticleToDraft: createArticle.isPending,
    isSubmittingArticle: submitForReview.isPending,
    isSavingExistingArticle: editArticle.isPending,
  };
}
