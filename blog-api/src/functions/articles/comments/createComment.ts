import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { z } from "zod";
import { lambdaHttpAdapter } from "../../../adapters/lambdaHttpAdapter";
import { dynamoClient } from "../../../clients/dynamoClient";
import { ApplicationError } from "../../../errors/ApplicationError";
import { dynamoErrorMapper } from "../../../errors/mappers/dynamoErrorMapper";
import { randomUUID } from "node:crypto";

const schema = z.object({
  content: z.string().min(1, "Conteúdo é obrigatório"),
});

export const handler = lambdaHttpAdapter<
  "private",
  CreateComment.Params,
  CreateComment.Response,
  CreateComment.UrlParams
>(
  async ({ body, params, accountId }) => {
    const { Item: article } = await dynamoClient.send(
      new GetCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          PK: `ARTICLE#${params.articleId}`,
          SK: "INFO",
        },
      }),
    );

    if (!article) {
      throw new ApplicationError("Artigo não encontrado");
    }

    const uuid = randomUUID();
    const now = new Date().toISOString();

    await dynamoClient.send(
      new PutCommand({
        TableName: process.env.TABLE_NAME,
        Item: {
          PK: `ARTICLE#${params.articleId}`,
          SK: `COMMENT#${uuid}`,
          GSI1PK: `ACCOUNT#${accountId}`,
          GSI1SK: `COMMENT#${uuid}#CREATED_AT${now}`,
          commentId: uuid,
          articleId: params.articleId,
          accountId,
          content: body.content,
          createdAt: now,
          updatedAt: now,
        },
      }),
    );

    return { statusCode: 201 };
  },
  { schema, requiredRoles: ["student", "writer", "admin"], errorMapper: dynamoErrorMapper },
);

export namespace CreateComment {
  export type Params = z.infer<typeof schema>;
  export type UrlParams = { articleId: string };
  export type Response = void;
}
