import { useQuery } from "@tanstack/react-query";
import { listArticleLikes } from "../services/listArticleLikes";

export function useListArticleLikes({ articleId, enabled = true }: { articleId: string; enabled?: boolean }) {
  return useQuery({
    queryKey: ["article-likes", articleId],
    queryFn: () => listArticleLikes({ articleId }),
    enabled: enabled && !!articleId,
  });
}
