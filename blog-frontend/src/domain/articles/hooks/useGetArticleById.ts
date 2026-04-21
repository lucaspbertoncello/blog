import { useQuery } from "@tanstack/react-query";
import { getArticleById } from "../services/getArticleById";

export function useGetArticleById({ articleId }: { articleId: string }) {
  const methods = useQuery({
    queryKey: ["article-by-id", articleId],
    queryFn: () => getArticleById({ articleId }),
  });

  return methods;
}
