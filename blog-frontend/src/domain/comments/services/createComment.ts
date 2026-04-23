import { httpClient } from "@/shared/lib/httpClient";

export async function createComment(params: CreateCommentService.Params) {
  await httpClient.post(`/articles/${params.articleId}/comments`, { content: params.content });
}

export namespace CreateCommentService {
  export type Params = {
    articleId: string;
    content: string;
  };
}
