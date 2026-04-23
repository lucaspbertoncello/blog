import { useQuery } from "@tanstack/react-query";
import { listArticleComments } from "../services/listArticleComments";

export function useListArticleComments({
  articleId,
  enabled = true,
}: {
  articleId: string;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: ["article-comments", articleId],
    queryFn: () => listArticleComments({ articleId }),
    enabled: enabled && !!articleId,
  });
}
