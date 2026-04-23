import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteArticle } from "@/domain/articles/hooks/useDeleteArticle";
import { usePublishArticle } from "@/domain/articles/hooks/usePublishArticle";
import { useRejectArticle } from "@/domain/articles/hooks/useRejectArticle";

export function useAdminArticleActions() {
  const queryClient = useQueryClient();
  const publishArticle = usePublishArticle();
  const rejectArticle = useRejectArticle();
  const deleteArticle = useDeleteArticle();
  const [publishConfirmId, setPublishConfirmId] = useState<string | null>(null);
  const [rejectConfirmId, setRejectConfirmId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

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
