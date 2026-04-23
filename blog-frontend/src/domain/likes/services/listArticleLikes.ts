import { httpClient } from "@/shared/lib/httpClient";
import type { ArticleLikes } from "../types/ArticleLike";

export async function listArticleLikes(params: ListArticleLikesService.Params) {
  const { data } = await httpClient.get<ListArticleLikesService.Response>(
    `/articles/${params.articleId}/likes`
  );

  return data;
}

export namespace ListArticleLikesService {
  export type Params = { articleId: string };
  export type Response = ArticleLikes;
}
