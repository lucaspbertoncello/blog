import { httpClient } from "@/shared/lib/httpClient";

export async function unlikeArticle(params: UnlikeArticleService.Params) {
  await httpClient.delete(`/articles/${params.articleId}/likes`);
}

export namespace UnlikeArticleService {
  export type Params = { articleId: string };
}
