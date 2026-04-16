import { DeleteCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { lambdaHttpAdapter } from "../../../adapters/lambdaHttpAdapter";
import { dynamoClient } from "../../../clients/dynamoClient";
import { ApplicationError } from "../../../errors/ApplicationError";
import { dynamoErrorMapper } from "../../../errors/mappers/dynamoErrorMapper";

export const handler = lambdaHttpAdapter<"private", undefined, void, DeleteComment.UrlParams>(
  async ({ params, accountId, role }) => {
    const { articleId, commentId } = params;

    const [{ Item: article }, { Item: comment }] = await Promise.all([
      dynamoClient.send(
        new GetCommand({
          TableName: process.env.TABLE_NAME,
          Key: { PK: `ARTICLE#${articleId}`, SK: "INFO" },
        }),
      ),
      dynamoClient.send(
        new GetCommand({
          TableName: process.env.TABLE_NAME,
          Key: { PK: `ARTICLE#${articleId}`, SK: `COMMENT#${commentId}` },
        }),
      ),
    ]);

    if (!article) {
      throw new ApplicationError("Artigo não encontrado");
    }

    if (!comment) {
      throw new ApplicationError("Comentário não encontrado");
    }

    if (role !== "admin" && comment.accountId !== accountId) {
      throw new ApplicationError("Você não tem permissão para deletar este comentário");
    }

    console.log("chegou aq");

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
