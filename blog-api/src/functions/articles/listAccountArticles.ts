import { GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { lambdaHttpAdapter } from "../../adapters/lambdaHttpAdapter";
import { dynamoClient } from "../../clients/dynamoClient";
import { ApplicationError } from "../../errors/ApplicationError";
import { dynamoErrorMapper } from "../../errors/mappers/dynamoErrorMapper";
import { Article } from "../../types/Article";

export const handler = lambdaHttpAdapter<
  "private",
  undefined,
  ListAccountArticles.Response,
  ListAccountArticles.UrlParams
>(
  async ({ params, accountId, role }) => {
    const { accountId: targetAccountId } = params;

    if (role === "writer" && targetAccountId !== accountId) {
      throw new ApplicationError("Sem permissão para visualizar artigos de outro usuário");
    }

    const { Item: account } = await dynamoClient.send(
      new GetCommand({
        TableName: process.env.TABLE_NAME,
        Key: { PK: `ACCOUNT#${targetAccountId}`, SK: "INFO" },
      }),
    );

    if (!account) {
      throw new ApplicationError("Usuário não encontrado");
    }

    const { Items, Count } = await dynamoClient.send(
      new QueryCommand({
        TableName: process.env.TABLE_NAME,
        IndexName: "GSI2",
        KeyConditionExpression: "GSI2PK = :pk",
        FilterExpression: "accountId = :accountId",
        ExpressionAttributeValues: {
          ":pk": "ARTICLES",
          ":accountId": targetAccountId,
        },
        ProjectionExpression: "articleId, title, #status, slug, visibility, tags, createdAt, updatedAt",
        ExpressionAttributeNames: {
          "#status": "status",
        },
      }),
    );

    return {
      statusCode: 200,
      body: {
        count: Count ?? 0,
        articles: (Items ?? []) as Array<Omit<Article, "content">>,
      },
    };
  },
  { requiredRoles: ["writer", "admin"], errorMapper: dynamoErrorMapper },
);

export namespace ListAccountArticles {
  export type UrlParams = { accountId: string };
  export type Response = {
    count: number;
    articles: Array<Omit<Article, "content">>;
  };
}
