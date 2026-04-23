import { useGetArticleBySlug } from "@/domain/articles/hooks/useGetArticleBySlug";
import { useAuthStore } from "@/domain/auth/stores/useAuthStore";
import { useUserStore } from "@/domain/users/stores/useUserStore";
import { useParams } from "@tanstack/react-router";
import { useArticleLikeActions } from "./hooks/useArticleLikeActions";

export function useArticlePageModel() {
  const { articleSlug } = useParams({ from: "/public/feed/articles/$articleSlug" });
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const accountId = useUserStore((state) => state.account?.accountId);

  const { data, isFetching, error, refetch } = useGetArticleBySlug({ articleSlug, isAuthenticated });
  const like = useArticleLikeActions({ article: data, accountId, isAuthenticated });

  return {
    article: data,
    isFetchingArticle: isFetching,
    getArticleError: error,
    refetchArticle: refetch,
    like,
  };
}
