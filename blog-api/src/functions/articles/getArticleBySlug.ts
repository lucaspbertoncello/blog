import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { lambdaHttpAdapter } from "../../adapters/lambdaHttpAdapter";
import { Article } from "../../types/Article";
import { dynamoClient } from "../../clients/dynamoClient";
import { ApplicationError } from "../../errors/ApplicationError";
import { dynamoErrorMapper } from "../../errors/mappers/dynamoErrorMapper";

export const handler = lambdaHttpAdapter<
  "private",
  undefined,
  GetArticleBySlug.Response,
  GetArticleBySlug.UrlParams
>(
  async ({ params }) => {
    const { Item: slugItem } = await dynamoClient.send(new GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: { PK: `SLUG#${params.slug}`, SK: "INFO" },
    }));

    if (!slugItem) {
      throw new ApplicationError("Artigo não encontrado");
    }

    const { Item } = await dynamoClient.send(new GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: { PK: `ARTICLE#${slugItem.articleId}`, SK: "INFO" },
    }));

    if (!Item) {
      throw new ApplicationError("Artigo não encontrado");
    }

    const article = Item as Article;

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
