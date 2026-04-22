import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSubmitArticleToReview } from "@/domain/articles/hooks/useSubmitArticleToReview";
import { useDeleteArticle } from "@/domain/articles/hooks/useDeleteArticle";
import type { ArticleListItem } from "@/domain/articles/types/Article";

type UseArticleReviewActionsProps = {
  accountId: string;
};

export function useArticleReviewActions({ accountId }: UseArticleReviewActionsProps) {
  const queryClient = useQueryClient();
  const submitForReview = useSubmitArticleToReview();
  const deleteArticle = useDeleteArticle();
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const onSubmitForReview = async (articleId: string) => {
    setSubmittingId(articleId);
    try {
      await submitForReview.mutateAsync({ articleId });
      queryClient.invalidateQueries({ queryKey: ["account-articles", accountId] });
    } finally {
      setSubmittingId(null);
    }
  };

  const onDeleteArticle = async (articleId: string) => {
    setDeletingId(articleId);
    try {
      await deleteArticle.mutateAsync({ articleId });
      queryClient.invalidateQueries({ queryKey: ["account-articles", accountId] });
    } finally {
      setDeletingId(null);
    }
  };

  const canSubmitArticleForReview = (article: ArticleListItem): boolean => {
    return article.status === "draft" || article.status === "rejected";
  };

  return {
    onSubmitForReview,
    canSubmitArticleForReview,
    submittingId,
    onDeleteArticle,
    deletingId,
  };
}
