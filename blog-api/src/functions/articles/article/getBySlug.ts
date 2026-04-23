import { lambdaHttpAdapter } from "../../../adapters/lambdaHttpAdapter";
import { ApplicationError } from "../../../errors/ApplicationError";
import { dynamoErrorMapper } from "../../../errors/mappers/dynamoErrorMapper";
import { Article } from "../../../types/Article";
import { getArticleBySlugOrThrow } from "../_shared/getArticleBySlugOrThrow";

export const handler = lambdaHttpAdapter<
  "private",
  undefined,
  GetArticleBySlug.Response,
  GetArticleBySlug.UrlParams
>(
  async ({ params }) => {
    const article = await getArticleBySlugOrThrow(params.slug);

    if (article.status !== "published") {
      throw new ApplicationError("Artigo não encontrado");
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
  },
  { errorMapper: dynamoErrorMapper },
);

export namespace GetArticleBySlug {
  export type Response = Article;
  export type UrlParams = { slug: string };
}
