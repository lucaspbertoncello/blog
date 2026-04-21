import { useArticleEditorForm } from "./hooks/useArticleEditorForm";
import { useEditorContent } from "./hooks/useEditorContent";
import { useGetArticleById } from "@/domain/articles/hooks/useGetArticleById";

export function useArticleEditorModel(articleId?: string) {
  const { data, isLoading } = useGetArticleById({
    articleId: articleId ?? "",
    enabled: !!articleId,
  });

  const articleForm = useArticleEditorForm({ articleBeingEdited: data ?? null, articleId });
  const editor = useEditorContent((v) => articleForm.form.setFieldValue("content", v));

  return {
    articleForm,
    editor,
    isEditing: !!articleId,
    isLoadingArticle: isLoading && !!articleId,
  };
}
