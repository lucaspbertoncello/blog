import { httpClient } from "@/shared/lib/httpClient";

export async function publishArticle(params: PublishArticleService.Params) {
  await httpClient.patch(`/articles/${params.articleId}/publish`);
}

export namespace PublishArticleService {
  export type Params = { articleId: string };
}
