import { useQuery } from "@tanstack/react-query";
import { listArticlesByStatus } from "../services/listArticlesByStatus";
import type { ArticleStatus } from "../types/Article";

type UseListArticlesByStatusProps = {
  status?: ArticleStatus | "all";
  enabled?: boolean;
};

export function useListArticlesByStatus({
  status,
  enabled = true,
}: UseListArticlesByStatusProps) {
  return useQuery({
    queryKey: ["admin-articles", status ?? "all"],
    queryFn: () => listArticlesByStatus({ status }),
    enabled,
  });
}
