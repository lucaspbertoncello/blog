import { useListArticleComments } from "@/domain/comments/hooks/useListArticleComments";
import type { Article } from "@/domain/articles/types/Article";

type UseArticleCommentsProps = {
  article?: Article;
  isAuthenticated: boolean;
};

export function useArticleComments({ article, isAuthenticated }: UseArticleCommentsProps) {
  const articleId = article?.articleId ?? "";

  const articleComments = useListArticleComments({
    articleId,
    enabled: isAuthenticated && !!articleId,
  });

  return {
    comments: articleComments.data?.comments ?? [],
    commentsCount: articleComments.data?.count ?? 0,
    commentsCountLabel: isAuthenticated ? String(articleComments.data?.count ?? 0) : "-",
    isLoadingComments: articleComments.isLoading,
    isCommentsUnavailable: !isAuthenticated,
  };
}
