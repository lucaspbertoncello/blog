import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSubmitArticleToReview } from "@/domain/articles/hooks/useSubmitArticleToReview";
import type { ArticleListItem } from "@/domain/articles/types/Article";

type UseArticleReviewActionsProps = {
  accountId: string;
};

export function useArticleReviewActions({ accountId }: UseArticleReviewActionsProps) {
  const queryClient = useQueryClient();
  const submitForReview = useSubmitArticleToReview();
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const onSubmitForReview = async (articleId: string) => {
    setSubmittingId(articleId);
    try {
      await submitForReview.mutateAsync({ articleId });
      queryClient.invalidateQueries({ queryKey: ["account-articles", accountId] });
    } finally {
      setSubmittingId(null);
    }
  };

  const canSubmitArticleForReview = (article: ArticleListItem): boolean => {
    return article.status === "draft" || article.status === "rejected";
  };

  return {
    onSubmitForReview,
    canSubmitArticleForReview,
    submittingId,
  };
}
