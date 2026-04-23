import { useArticleEditorForm } from "./hooks/useArticleEditorForm";
import { useArticleUploadImage } from "./hooks/useArticleUploadImage";
import { useEditorContent } from "./hooks/useEditorContent";
import { useGetArticleById } from "@/domain/articles/hooks/useGetArticleById";

export function useArticleEditorModel(articleId?: string) {
  const { data, isLoading } = useGetArticleById({
    articleId: articleId ?? "",
    enabled: !!articleId,
  });

  const articleForm = useArticleEditorForm({ articleBeingEdited: data ?? null, articleId });
  const editor = useEditorContent((v) => articleForm.form.setFieldValue("content", v));

  const imageUpload = useArticleUploadImage({
    textareaRef: editor.textareaRef,
    handleInsert: editor.handleInsert,
  });

  return {
    articleForm,
    editor,
    articleId,
    imageUpload,
    isEditing: !!articleId,
    isLoadingArticle: isLoading && !!articleId,
  };
}
