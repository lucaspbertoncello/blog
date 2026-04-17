import { useGetArticleBySlug } from "@/domain/articles/hooks/useGetArticleBySlug";
import { useAuthStore } from "@/domain/auth/stores/useAuthStore";
import { useParams } from "@tanstack/react-router";

export function useArticlePageModel() {
  const { articleSlug } = useParams({ from: "/public/articles/$articleSlug" });
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { data, isFetching, error, refetch } = useGetArticleBySlug({ articleSlug, isAuthenticated });

  return {
    article: data,
    isFetchingArticle: isFetching,
    getArticleError: error,
    refetchArticle: refetch,
  };
}
