import { httpClient } from "@/shared/lib/httpClient";

export async function deleteArticle(params: DeleteArticleService.Params) {
  const { data } = await httpClient.delete<DeleteArticleService.Response>(`/articles/${params.articleId}`);
  return data;
}

export namespace DeleteArticleService {
  export type Params = { articleId: string };
  export type Response = void;
}
