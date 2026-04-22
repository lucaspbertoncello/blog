import type { ArticleListItem } from "@/domain/articles/types/Article";
import { useListAccountArticles } from "@/domain/articles/hooks/useListAccountArticles";
import { useUserStore } from "@/domain/users/stores/useUserStore";
import { useArticleFilters } from "./hooks/useArticleFilters";
import { useArticleReviewActions } from "./hooks/useArticleReviewActions";

export type { ArticleListItem };
export type { StatusFilter } from "./hooks/useArticleFilters";

export function useArticlesPanelModel() {
  const { account } = useUserStore();
  const accountId = account?.accountId ?? "";

  const { data, isLoading } = useListAccountArticles({ accountId });

  const filters = useArticleFilters({ articles: (data?.articles ?? []) as ArticleListItem[] });
  const reviewActions = useArticleReviewActions({ accountId });

  return {
    articles: filters.filteredArticles,
    search: filters.search,
    setSearch: filters.setSearch,
    statusFilter: filters.statusFilter,
    setStatusFilter: filters.setStatusFilter,
    totalCount: data?.count ?? 0,
    isLoading,
    onSubmitForReview: reviewActions.onSubmitForReview,
    canSubmitArticleForReview: reviewActions.canSubmitArticleForReview,
    submittingId: reviewActions.submittingId,
  };
}
