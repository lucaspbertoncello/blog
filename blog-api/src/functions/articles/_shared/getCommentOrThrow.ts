import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoClient } from "../../../clients/dynamoClient";
import { ApplicationError } from "../../../errors/ApplicationError";
import { Comment } from "../../../types/Article";

export async function getCommentOrThrow(articleId: string, commentId: string): Promise<Comment> {
  const { Item } = await dynamoClient.send(
    new GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: { PK: `ARTICLE#${articleId}`, SK: `COMMENT#${commentId}` },
    }),
  );

  if (!Item) {
    throw new ApplicationError("Comentário não encontrado");
  }

  return Item as Comment;
}
