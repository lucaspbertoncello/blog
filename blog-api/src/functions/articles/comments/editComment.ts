import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { z } from "zod";
import { lambdaHttpAdapter } from "../../../adapters/lambdaHttpAdapter";
import { dynamoClient } from "../../../clients/dynamoClient";
import { ApplicationError } from "../../../errors/ApplicationError";
import { dynamoErrorMapper } from "../../../errors/mappers/dynamoErrorMapper";

const schema = z.object({
  content: z.string().min(1, "Conteúdo não pode ser vazio"),
});

export const handler = lambdaHttpAdapter<
  "private",
  EditComment.Params,
  EditComment.Response,
  EditComment.UrlParams
>(
  async ({ body, params, accountId }) => {
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

    if (comment.accountId !== accountId) {
      throw new ApplicationError("Você não tem permissão para editar este comentário");
    }

    await dynamoClient.send(
      new UpdateCommand({
        TableName: process.env.TABLE_NAME,
        Key: { PK: `ARTICLE#${articleId}`, SK: `COMMENT#${commentId}` },
        UpdateExpression: "SET content = :content, updatedAt = :updatedAt",
        ExpressionAttributeValues: {
          ":content": body.content,
          ":updatedAt": new Date().toISOString(),
        },
      }),
    );

    return { statusCode: 200 };
  },
  { schema, requiredRoles: ["student", "writer", "admin"], errorMapper: dynamoErrorMapper },
);

export namespace EditComment {
  export type Params = z.infer<typeof schema>;
  export type Response = void;
  export type UrlParams = { articleId: string; commentId: string };
}
