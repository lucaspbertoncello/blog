import { useCallback, useState } from "react";
import type { ArticleStatus } from "@/domain/articles/types/Article";
import type { ListArticlesByStatusService } from "@/domain/articles/services/listArticlesByStatus";

export type AdminArticleItem = ListArticlesByStatusService.ArticleAdminItem;
export type AdminArticleStatusFilter = ArticleStatus | "all";

export function useAdminArticleFilters() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AdminArticleStatusFilter>("all");

  const filterArticles = useCallback((articles: AdminArticleItem[]) => {
    const q = search.toLowerCase();
    return articles.filter((a) => a.title.toLowerCase().includes(q));
  }, [search]);

  return {
    filterArticles,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
  };
}
