import { useQuery } from "@tanstack/react-query";
import { listArticlesByStatus } from "../services/listArticlesByStatus";
import type { ArticleStatus } from "../types/Article";

export function useListArticlesByStatus({ status }: { status?: ArticleStatus | "all" }) {
  return useQuery({
    queryKey: ["admin-articles", status ?? "all"],
    queryFn: () => listArticlesByStatus({ status }),
  });
}
