import { httpClient } from "@/shared/lib/httpClient";

export async function rejectArticle(params: RejectArticleService.Params) {
  await httpClient.patch(`/articles/${params.articleId}/reject`);
}

export namespace RejectArticleService {
  export type Params = { articleId: string };
}
