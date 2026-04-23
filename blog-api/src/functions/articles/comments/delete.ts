import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { lambdaHttpAdapter } from "../../../adapters/lambdaHttpAdapter";
import { dynamoClient } from "../../../clients/dynamoClient";
import { ApplicationError } from "../../../errors/ApplicationError";
import { dynamoErrorMapper } from "../../../errors/mappers/dynamoErrorMapper";
import { getArticleOrThrow } from "../_shared/getArticleOrThrow";
import { getCommentOrThrow } from "../_shared/getCommentOrThrow";

export const handler = lambdaHttpAdapter<"private", undefined, void, DeleteComment.UrlParams>(
  async ({ params, accountId, role }) => {
    const { articleId, commentId } = params;

    const [, comment] = await Promise.all([
      getArticleOrThrow(articleId),
      getCommentOrThrow(articleId, commentId),
    ]);

    if (role !== "admin" && comment.accountId !== accountId) {
      throw new ApplicationError("Você não tem permissão para deletar este comentário");
    }

    await dynamoClient.send(
      new DeleteCommand({
        TableName: process.env.TABLE_NAME,
        Key: { PK: `ARTICLE#${articleId}`, SK: `COMMENT#${commentId}` },
      }),
    );

    return { statusCode: 200 };
  },
  { requiredRoles: ["student", "writer", "admin"], errorMapper: dynamoErrorMapper },
);

export namespace DeleteComment {
  export type UrlParams = { articleId: string; commentId: string };
}
