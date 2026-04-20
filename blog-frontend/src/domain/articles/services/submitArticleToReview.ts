import { httpClient } from "@/shared/lib/httpClient";

export async function submitArticleToReviewService(params: SubmitArticleToReviewService.Params) {
  const { data } = await httpClient.patch<SubmitArticleToReviewService.Response>(
    `/articles/${params.articleId}/submit`
  );
  return data;
}

export namespace SubmitArticleToReviewService {
  export type Params = { articleId: string };
  export type Response = void;
}
