import { httpClient } from "@/shared/lib/httpClient";
import type { Article } from "../types/Article";

export async function listPublishedArticles() {
  const { data } = await httpClient.get<ListPublishedArticlesService.Response>("/articles/feed");
  return data;
}

export namespace ListPublishedArticlesService {
  export type Response = { count: number; articles: Omit<Article, "accountId" | "status">[] };
}
