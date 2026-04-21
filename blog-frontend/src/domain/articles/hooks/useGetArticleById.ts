import { useQuery } from "@tanstack/react-query";
import { getArticleById } from "../services/getArticleById";

export function useGetArticleById({ articleId, enabled }: { articleId: string; enabled?: boolean }) {
  const methods = useQuery({
    queryKey: ["article-by-id", articleId],
    queryFn: () => getArticleById({ articleId }),
    enabled: enabled || !articleId,
  });

  return methods;
}
