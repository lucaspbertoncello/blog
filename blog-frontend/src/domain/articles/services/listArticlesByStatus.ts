import { httpClient } from "@/shared/lib/httpClient";
import type { ArticleStatus } from "../types/Article";

export async function listArticlesByStatus(params: ListArticlesByStatusService.Params) {
  const { data } = await httpClient.get<ListArticlesByStatusService.Response>("/articles", {
    params: { status: params.status },
  });
  return data;
}

export namespace ListArticlesByStatusService {
  export type Params = { status?: ArticleStatus | "all" };
  export type ArticleAdminItem = {
    articleId: string;
    title: string;
    status: ArticleStatus;
    slug: string;
    visibility: "public" | "students_only";
    tags: string[];
    createdAt: string;
    updatedAt: string;
  };
  export type Response = { count: number; articles: ArticleAdminItem[] };
}
