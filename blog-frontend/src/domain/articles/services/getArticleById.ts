import { httpClient } from "@/shared/lib/httpClient";
import type { Article } from "../types/Article";

export async function getArticleById(params: GetArticleByIdService.Params) {
  const { data } = await httpClient.get<GetArticleByIdService.Response>(`/articles/${params.articleId}`);
  return data;
}

export namespace GetArticleByIdService {
  export type Params = { articleId: string };
  export type Response = Article;
}
