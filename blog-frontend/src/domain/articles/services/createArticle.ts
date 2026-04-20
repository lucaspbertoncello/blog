import { httpClient } from "@/shared/lib/httpClient";
import type { Article } from "../types/Article";

// save to draft
export async function createArticle(params: CreateArticleService.Params) {
  const { data } = await httpClient.post<CreateArticleService.Response>("/articles", params);
  return data;
}

export namespace CreateArticleService {
  export type Params = Pick<Article, "content" | "slug" | "title" | "tags" | "visibility">;
  export type Response = { articleId: string };
}
