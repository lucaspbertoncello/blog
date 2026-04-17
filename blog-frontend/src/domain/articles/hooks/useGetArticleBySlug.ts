import { useQuery } from "@tanstack/react-query";
import { getArticleBySlug } from "../services/getArticleBySlug";

export function useGetArticleBySlug({
  articleSlug,
  isAuthenticated,
}: {
  articleSlug: string;
  isAuthenticated: boolean;
}) {
  const methods = useQuery({
    queryFn: () => getArticleBySlug({ articleSlug, isAuthenticated }),
    queryKey: ["get-article-by-slug", articleSlug],
  });

  return methods;
}
