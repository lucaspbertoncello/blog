import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { lambdaHttpAdapter } from "../../adapters/lambdaHttpAdapter";
import { Article } from "../../types/Article";
import { dynamoClient } from "../../clients/dynamoClient";
import { ApplicationError } from "../../errors/ApplicationError";

export const handler = lambdaHttpAdapter<
  "public",
  undefined,
  GetPublicArticleBySlug.Response,
  GetPublicArticleBySlug.UrlParams
>(async ({ params }) => {
  const { Item: slugItem } = await dynamoClient.send(new GetCommand({
    TableName: process.env.TABLE_NAME,
    Key: { PK: `SLUG#${params.slug}`, SK: "INFO" },
  }));

  if (!slugItem) {
    throw new ApplicationError("Artigo inexistente");
  }

  const { Item } = await dynamoClient.send(new GetCommand({
    TableName: process.env.TABLE_NAME,
    Key: { PK: `ARTICLE#${slugItem.articleId}`, SK: "INFO" },
  }));

  if (!Item) {
    throw new ApplicationError("Artigo inexistente");
  }

  const article = Item as Article;

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
