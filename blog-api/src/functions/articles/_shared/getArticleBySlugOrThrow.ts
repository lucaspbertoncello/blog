import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoClient } from "../../../clients/dynamoClient";
import { ApplicationError } from "../../../errors/ApplicationError";
import { Article } from "../../../types/Article";
import { getArticleOrThrow } from "./getArticleOrThrow";

export async function getArticleBySlugOrThrow(slug: string): Promise<Article> {
  const { Item: slugItem } = await dynamoClient.send(
    new GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: { PK: `SLUG#${slug}`, SK: "INFO" },
    }),
  );

  if (!slugItem?.articleId) {
    throw new ApplicationError("Artigo não encontrado");
  }

  return getArticleOrThrow(slugItem.articleId as string);
}
