import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { lambdaHttpAdapter } from "../../adapters/lambdaHttpAdapter";
import { Article } from "../../types/Article";
import { dynamoClient } from "../../clients/dynamoClient";
import { ApplicationError } from "../../errors/ApplicationError";
import { dynamoErrorMapper } from "../../errors/mappers/dynamoErrorMapper";

export const handler = lambdaHttpAdapter<
  "private",
  undefined,
  GetArticleById.Response,
  GetArticleById.UrlParams
>(
  async ({ params, accountId, role }) => {
    const command = new GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        PK: `ARTICLE#${params.articleId}`,
        SK: "INFO",
      },
    });

    const { Item } = await dynamoClient.send(command);

    if (!Item) {
      throw new ApplicationError("Artigo não encontrado");
    }

    const article = Item as Article;

    if (role === "writer" && article.accountId !== accountId) {
      throw new ApplicationError("Acesso negado");
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
  { requiredRoles: ["writer", "admin"], errorMapper: dynamoErrorMapper },
);

export namespace GetArticleById {
  export type Response = Article;
  export type UrlParams = { articleId: string };
}
