import { useListAccountArticles } from "@/domain/articles/hooks/useListAccountArticles";
import { useUserStore } from "@/domain/users/stores/useUserStore";
import { useArticleEditorForm } from "./hooks/useArticleEditorForm";
import { useEditorContent } from "./hooks/useEditorContent";

export function useArticleEditorModel(articleId?: string) {
  const { account } = useUserStore();
  const accountId = account?.accountId ?? "";

  // Only fetch when editing an existing article
  const { data, isLoading } = useListAccountArticles({
    accountId,
    enabled: !!articleId,
  });

  const articleBeingEdited = articleId
    ? (data?.articles.find((a) => a.articleId === articleId) ?? null)
    : null;

  const articleForm = useArticleEditorForm({ articleBeingEdited, articleId });
  const editor = useEditorContent((v) => articleForm.form.setFieldValue("content", v));

  return {
    articleForm,
    editor,
    isEditing: !!articleId,
    isLoadingArticle: isLoading && !!articleId,
  };
}
