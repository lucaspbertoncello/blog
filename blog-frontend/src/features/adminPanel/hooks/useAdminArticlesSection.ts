import { useMemo } from "react";
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
  const {
    filterArticles,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
  } = useAdminArticleFilters();
  const { data, isLoading, isError, refetch } = useListArticlesByStatus({
    status: statusFilter,
    enabled,
  });
  const articleActions = useAdminArticleActions();
  const articles = useMemo(
    () => filterArticles(data?.articles ?? []),
    [data?.articles, filterArticles]
  );

  return {
    articles,
    totalCount: data?.count ?? 0,
    isLoading,
    isError,
    refetch,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
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
