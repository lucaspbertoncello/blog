import { useListPublishedArticles } from "@/domain/articles/hooks/useListPublishedArticles";

export function useFeedModel() {
  const { data, isFetching, error, refetch } = useListPublishedArticles();

  return {
    articles: data?.articles ?? [],
    count: data?.count,
    isLoadingPublishedArticles: isFetching,
    listArticlesError: error,
    refetchArticles: refetch,
  };
}
