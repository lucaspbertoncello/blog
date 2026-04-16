import { DeleteCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { lambdaHttpAdapter } from "../../../adapters/lambdaHttpAdapter";
import { dynamoClient } from "../../../clients/dynamoClient";
import { ApplicationError } from "../../../errors/ApplicationError";
import { dynamoErrorMapper } from "../../../errors/mappers/dynamoErrorMapper";

export const handler = lambdaHttpAdapter<"private", undefined, void, UnlikeArticle.UrlParams>(
  async ({ params, accountId }) => {
    const { articleId } = params;

    const { Item: article } = await dynamoClient.send(new GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: { PK: `ARTICLE#${articleId}`, SK: "INFO" },
    }));

    if (!article) {
      throw new ApplicationError("Artigo não encontrado");
    }

    const { Item: like } = await dynamoClient.send(new GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: { PK: `ARTICLE#${articleId}`, SK: `LIKE#${accountId}` },
    }));

    if (!like) {
      throw new ApplicationError("Você não curtiu este artigo");
    }

    await dynamoClient.send(new DeleteCommand({
      TableName: process.env.TABLE_NAME,
      Key: { PK: `ARTICLE#${articleId}`, SK: `LIKE#${accountId}` },
    }));

    return { statusCode: 200 };
  },
  { requiredRoles: ["student", "writer", "admin"], errorMapper: dynamoErrorMapper },
);

export namespace UnlikeArticle {
  export type UrlParams = { articleId: string };
}
