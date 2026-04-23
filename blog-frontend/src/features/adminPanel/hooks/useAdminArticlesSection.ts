import { useListArticlesByStatus } from "@/domain/articles/hooks/useListArticlesByStatus";
import { useAdminArticleActions } from "./useAdminArticleActions";
import { useAdminArticleFilters } from "./useAdminArticleFilters";

export type {
  AdminArticleItem,
  AdminArticleStatusFilter,
} from "./useAdminArticleFilters";

type UseAdminArticlesSectionProps = {
  enabled: boolean;
};

export function useAdminArticlesSection({ enabled }: UseAdminArticlesSectionProps) {
  const filters = useAdminArticleFilters();
  const { data, isLoading, isError, refetch } = useListArticlesByStatus({
    status: filters.statusFilter,
    enabled,
  });
  const articleActions = useAdminArticleActions();

  return {
    articles: filters.filterArticles(data?.articles ?? []),
    totalCount: data?.count ?? 0,
    isLoading,
    isError,
    refetch,
    search: filters.search,
    setSearch: filters.setSearch,
    statusFilter: filters.statusFilter,
    setStatusFilter: filters.setStatusFilter,
    publishConfirmId: articleActions.publishConfirmId,
    setPublishConfirmId: articleActions.setPublishConfirmId,
    rejectConfirmId: articleActions.rejectConfirmId,
    setRejectConfirmId: articleActions.setRejectConfirmId,
    deleteConfirmId: articleActions.deleteConfirmId,
    setDeleteConfirmId: articleActions.setDeleteConfirmId,
    onPublishConfirm: articleActions.onPublishConfirm,
    onRejectConfirm: articleActions.onRejectConfirm,
    onDeleteConfirm: articleActions.onDeleteConfirm,
    isPublishing: articleActions.isPublishing,
    isRejecting: articleActions.isRejecting,
    isDeleting: articleActions.isDeleting,
  };
}
