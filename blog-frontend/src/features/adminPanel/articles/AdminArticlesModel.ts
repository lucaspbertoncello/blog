import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useListArticlesByStatus } from "@/domain/articles/hooks/useListArticlesByStatus";
import { usePublishArticle } from "@/domain/articles/hooks/usePublishArticle";
import { useRejectArticle } from "@/domain/articles/hooks/useRejectArticle";
import { useDeleteArticle } from "@/domain/articles/hooks/useDeleteArticle";
import type { ArticleStatus } from "@/domain/articles/types/Article";
import type { ListArticlesByStatusService } from "@/domain/articles/services/listArticlesByStatus";

export type AdminArticleItem = ListArticlesByStatusService.ArticleAdminItem;
export type AdminArticleStatusFilter = ArticleStatus | "all";

export function useAdminArticlesModel() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<AdminArticleStatusFilter>("all");
  const [search, setSearch] = useState("");
  const [publishConfirmId, setPublishConfirmId] = useState<string | null>(null);
  const [rejectConfirmId, setRejectConfirmId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useListArticlesByStatus({ status: statusFilter });

  const publishArticle = usePublishArticle();
  const rejectArticle = useRejectArticle();
  const deleteArticle = useDeleteArticle();

  const filteredArticles = useMemo(() => {
    const q = search.toLowerCase();
    return (data?.articles ?? []).filter((a) => a.title.toLowerCase().includes(q));
  }, [data, search]);

  const invalidateArticles = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-articles"] });

  const onPublishConfirm = async () => {
    if (!publishConfirmId) return;
    await publishArticle.mutateAsync({ articleId: publishConfirmId });
    setPublishConfirmId(null);
    invalidateArticles();
  };

  const onRejectConfirm = async () => {
    if (!rejectConfirmId) return;
    await rejectArticle.mutateAsync({ articleId: rejectConfirmId });
    setRejectConfirmId(null);
    invalidateArticles();
  };

  const onDeleteConfirm = async () => {
    if (!deleteConfirmId) return;
    await deleteArticle.mutateAsync({ articleId: deleteConfirmId });
    setDeleteConfirmId(null);
    invalidateArticles();
  };

  return {
    articles: filteredArticles,
    totalCount: data?.count ?? 0,
    isLoading,
    isError,
    refetch,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    publishConfirmId,
    setPublishConfirmId,
    rejectConfirmId,
    setRejectConfirmId,
    deleteConfirmId,
    setDeleteConfirmId,
    onPublishConfirm,
    onRejectConfirm,
    onDeleteConfirm,
    isPublishing: publishArticle.isPending,
    isRejecting: rejectArticle.isPending,
    isDeleting: deleteArticle.isPending,
  };
}
