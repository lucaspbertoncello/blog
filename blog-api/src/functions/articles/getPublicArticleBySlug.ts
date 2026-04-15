import { QueryCommand } from "@aws-sdk/lib-dynamodb";
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
  const command = new QueryCommand({
    TableName: process.env.TABLE_NAME,
    IndexName: "GSI1",
    KeyConditionExpression: "GSI1PK = :pk",
    ExpressionAttributeValues: {
      ":pk": `SLUG#${params.articleId}`,
    },
  });

  const { Items, Count } = await dynamoClient.send(command);

  if (!Count || !Items) {
    throw new ApplicationError("Artigo inexistente");
  }

  const article = Items[0] as Article;

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
  export type UrlParams = { articleId: string };
}
