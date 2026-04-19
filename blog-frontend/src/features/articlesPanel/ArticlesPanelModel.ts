import { useState, useMemo } from "react";
import type { Article, ArticleStatus } from "@/domain/articles/types/Article";

export type ArticleListItem = Omit<Article, "content">;
export type StatusFilter = ArticleStatus | "all";

const MOCK_ARTICLES: ArticleListItem[] = [
  {
    articleId: "1",
    accountId: "acc-1",
    title: "Como usar React hooks avançados",
    slug: "como-usar-react-hooks-avancados",
    tags: ["react", "hooks"],
    status: "published",
    visibility: "public",
    createdAt: "2025-01-12T10:00:00.000Z",
    updatedAt: "2025-01-14T10:00:00.000Z",
  },
  {
    articleId: "2",
    accountId: "acc-1",
    title: "TypeScript avançado para desenvolvedores",
    slug: "typescript-avancado",
    tags: ["typescript"],
    status: "in_review",
    visibility: "public",
    createdAt: "2025-01-08T10:00:00.000Z",
    updatedAt: "2025-01-08T10:00:00.000Z",
  },
  {
    articleId: "3",
    accountId: "acc-1",
    title: "Introdução ao Docker e containers",
    slug: "introducao-ao-docker",
    tags: ["docker", "devops"],
    status: "draft",
    visibility: "students_only",
    createdAt: "2025-01-03T10:00:00.000Z",
    updatedAt: "2025-01-03T10:00:00.000Z",
  },
  {
    articleId: "4",
    accountId: "acc-1",
    title: "Configurando CI/CD com GitHub Actions",
    slug: "cicd-github-actions",
    tags: ["cicd", "github"],
    status: "rejected",
    visibility: "public",
    createdAt: "2024-12-20T10:00:00.000Z",
    updatedAt: "2024-12-22T10:00:00.000Z",
  },
  {
    articleId: "5",
    accountId: "acc-1",
    title: "Guia completo de CSS Grid",
    slug: "guia-css-grid",
    tags: ["css", "frontend"],
    status: "draft",
    visibility: "public",
    createdAt: "2024-12-10T10:00:00.000Z",
    updatedAt: "2024-12-10T10:00:00.000Z",
  },
];

export function useArticlesPanelModel() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredArticles = useMemo(() => {
    const searchLower = search.toLowerCase();
    return MOCK_ARTICLES.filter((a) => {
      const matchesSearch = a.title.toLowerCase().includes(searchLower);
      const matchesStatus =
        statusFilter === "all" || a.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  return {
    articles: filteredArticles,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    totalCount: MOCK_ARTICLES.length,
  };
}
