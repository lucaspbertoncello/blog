import { lambdaHttpAdapter } from "../../../adapters/lambdaHttpAdapter";
import { ApplicationError } from "../../../errors/ApplicationError";
import { Article } from "../../../types/Article";
import { getArticleBySlugOrThrow } from "../_shared/getArticleBySlugOrThrow";

export const handler = lambdaHttpAdapter<
  "public",
  undefined,
  GetPublicArticleBySlug.Response,
  GetPublicArticleBySlug.UrlParams
>(async ({ params }) => {
  const article = await getArticleBySlugOrThrow(params.slug);

  if (article.visibility === "students_only") {
    throw new ApplicationError("Você não tem permissão para ler esse artigo");
  }

  return {
    statusCode: 200,
    body: {
      articleId: article.articleId,
      accountId: article.accountId,
      title: article.title,
      content: article.content,
      slug: article.slug,
      tags: article.tags,
      status: article.status,
      visibility: article.visibility,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    },
  };
});

export namespace GetPublicArticleBySlug {
  export type Response = Article;
  export type UrlParams = { slug: string };
}
