import { httpClient } from "@/shared/lib/httpClient";
import type { ArticleComments } from "../types/ArticleComment";

export async function listArticleComments(params: ListArticleCommentsService.Params) {
  const { data } = await httpClient.get<ListArticleCommentsService.Response>(
    `/articles/${params.articleId}/comments`
  );

  return data;
}

export namespace ListArticleCommentsService {
  export type Params = { articleId: string };
  export type Response = ArticleComments;
}
