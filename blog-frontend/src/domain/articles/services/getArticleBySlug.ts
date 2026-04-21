import { httpClient } from "@/shared/lib/httpClient";
import type { Article } from "../types/Article";

export async function getArticleBySlug(params: GetPublicArticleBySlug.Params) {
  const baseUrl = params.isAuthenticated ? "/articles/slug" : "/articles/public";

  const { data } = await httpClient.get<GetPublicArticleBySlug.Response>(`${baseUrl}/${params.articleSlug}`);
  return data;
}

export namespace GetPublicArticleBySlug {
  export type Params = { isAuthenticated: boolean; articleSlug: string };
  export type Response = Article;
}
