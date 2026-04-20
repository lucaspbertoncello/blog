import { httpClient } from "@/shared/lib/httpClient";
import type { Article } from "../types/Article";

export async function editArticle(params: EditArticleService.Params) {
  const { data } = await httpClient.patch(`/articles/${params.articleId}`, params);
  return data;
}

export namespace EditArticleService {
  export type Params = Pick<Article, "title" | "content" | "tags" | "visibility"> & { articleId: string };
  export type Response = void;
}
