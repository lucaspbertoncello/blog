import { useState, useMemo } from "react";
import type { ArticleListItem, ArticleStatus } from "@/domain/articles/types/Article";

export type StatusFilter = ArticleStatus | "all";

type UseArticleFiltersProps = {
  articles: ArticleListItem[];
};

export function useArticleFilters({ articles }: UseArticleFiltersProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredArticles = useMemo(() => {
    const searchLower = search.toLowerCase();
    return articles.filter((a) => {
      const matchesSearch = a?.title?.toLowerCase().includes(searchLower);
      const matchesStatus = statusFilter === "all" || a.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [articles, search, statusFilter]);

  return {
    filteredArticles,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
  };
}
