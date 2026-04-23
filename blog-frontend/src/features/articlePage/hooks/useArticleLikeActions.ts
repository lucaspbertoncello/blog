import { useQueryClient } from "@tanstack/react-query";
import { useLikeArticle } from "@/domain/likes/hooks/useLikeArticle";
import { useListArticleLikes } from "@/domain/likes/hooks/useListArticleLikes";
import { useUnlikeArticle } from "@/domain/likes/hooks/useUnlikeArticle";
import type { Article } from "@/domain/articles/types/Article";

type UseArticleLikeActionsProps = {
  article?: Article;
  accountId?: string;
  isAuthenticated: boolean;
};

export function useArticleLikeActions({ article, accountId, isAuthenticated }: UseArticleLikeActionsProps) {
  const queryClient = useQueryClient();
  const likeArticle = useLikeArticle();
  const unlikeArticle = useUnlikeArticle();
  const articleId = article?.articleId ?? "";

  const articleLikes = useListArticleLikes({
    articleId,
    enabled: isAuthenticated && !!articleId,
  });

  const likedByMe = !!accountId && !!articleLikes.data?.likes.some((like) => like.accountId === accountId);
  const isTogglingLike = likeArticle.isPending || unlikeArticle.isPending;
  const canToggleLike =
    isAuthenticated && !!accountId && !!articleId && !articleLikes.isLoading && !isTogglingLike;

  const onToggleLike = async () => {
    if (!canToggleLike) return;

    try {
      if (likedByMe) {
        await unlikeArticle.mutateAsync({ articleId });
      } else {
        await likeArticle.mutateAsync({ articleId });
      }

      await queryClient.invalidateQueries({ queryKey: ["article-likes", articleId] });
    } catch {
      return;
    }
  };

  return {
    likesCount: articleLikes.data?.count ?? 0,
    likedByMe,
    isFetchingLikes: articleLikes.isFetching,
    isTogglingLike,
    canToggleLike,
    toggleLikeTitle: !isAuthenticated ? "Entre para curtir" : undefined,
    onToggleLike,
  };
}
