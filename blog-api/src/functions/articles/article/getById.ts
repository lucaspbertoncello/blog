import { lambdaHttpAdapter } from "../../../adapters/lambdaHttpAdapter";
import { dynamoErrorMapper } from "../../../errors/mappers/dynamoErrorMapper";
import { Article } from "../../../types/Article";
import { assertWriterOwnsArticle } from "../_shared/assertWriterOwnsArticle";
import { getArticleOrThrow } from "../_shared/getArticleOrThrow";

export const handler = lambdaHttpAdapter<
  "private",
  undefined,
  GetArticleById.Response,
  GetArticleById.UrlParams
>(
  async ({ params, accountId, role }) => {
    const article = await getArticleOrThrow(params.articleId);

    assertWriterOwnsArticle({ article, accountId, role });

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
  { requiredRoles: ["writer", "admin"], errorMapper: dynamoErrorMapper },
);

export namespace GetArticleById {
  export type Response = Article;
  export type UrlParams = { articleId: string };
}
