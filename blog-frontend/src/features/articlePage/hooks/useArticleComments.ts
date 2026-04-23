import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateComment } from "@/domain/comments/hooks/useCreateComment";
import { useListArticleComments } from "@/domain/comments/hooks/useListArticleComments";
import type { Article } from "@/domain/articles/types/Article";

type UseArticleCommentsProps = {
  article?: Article;
  isAuthenticated: boolean;
};

export function useArticleComments({ article, isAuthenticated }: UseArticleCommentsProps) {
  const queryClient = useQueryClient();
  const createComment = useCreateComment();
  const [commentText, setCommentText] = useState("");
  const articleId = article?.articleId ?? "";

  const articleComments = useListArticleComments({
    articleId,
    enabled: isAuthenticated && !!articleId,
  });

  const canSubmitComment =
    isAuthenticated && !!articleId && commentText.trim().length > 0 && !createComment.isPending;

  const onSubmitComment = async () => {
    if (!canSubmitComment) return;

    try {
      await createComment.mutateAsync({ articleId, content: commentText.trim() });
      setCommentText("");
      await queryClient.invalidateQueries({ queryKey: ["article-comments", articleId] });
    } catch {
      return;
    }
  };

  return {
    comments: articleComments.data?.comments ?? [],
    commentsCount: articleComments.data?.count ?? 0,
    commentsCountLabel: isAuthenticated ? String(articleComments.data?.count ?? 0) : "-",
    commentText,
    setCommentText,
    isLoadingComments: articleComments.isLoading,
    isCreatingComment: createComment.isPending,
    isCommentsUnavailable: !isAuthenticated,
    canSubmitComment,
    onSubmitComment,
  };
}
