import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoClient } from "../../../clients/dynamoClient";
import { ApplicationError } from "../../../errors/ApplicationError";
import { Article } from "../../../types/Article";

export async function getArticleOrThrow(articleId: string): Promise<Article> {
  const { Item } = await dynamoClient.send(
    new GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: { PK: `ARTICLE#${articleId}`, SK: "INFO" },
    }),
  );

  if (!Item) {
    throw new ApplicationError("Artigo não encontrado");
  }

  return Item as Article;
}
