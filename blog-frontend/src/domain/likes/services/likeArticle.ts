import { httpClient } from "@/shared/lib/httpClient";

export async function likeArticle(params: LikeArticleService.Params) {
  await httpClient.post(`/articles/${params.articleId}/likes`);
}

export namespace LikeArticleService {
  export type Params = { articleId: string };
}
