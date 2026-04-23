import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { lambdaHttpAdapter } from "../../../adapters/lambdaHttpAdapter";
import { dynamoClient } from "../../../clients/dynamoClient";
import { dynamoErrorMapper } from "../../../errors/mappers/dynamoErrorMapper";
import { getArticleOrThrow } from "../_shared/getArticleOrThrow";

export const handler = lambdaHttpAdapter<
  "private",
  undefined,
  ListArticleLikes.Response,
  ListArticleLikes.UrlParams
>(
  async ({ params }) => {
    const { articleId } = params;

    await getArticleOrThrow(articleId);

    const { Items, Count } = await dynamoClient.send(
      new QueryCommand({
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
        ExpressionAttributeValues: {
          ":pk": `ARTICLE#${articleId}`,
          ":skPrefix": "LIKE#",
        },
        ProjectionExpression: "articleId, accountId, createdAt",
      }),
    );

    return {
      statusCode: 200,
      body: {
        count: Count ?? 0,
        likes: (Items ?? []) as Array<{ articleId: string; accountId: string; createdAt: string }>,
      },
    };
  },
  { requiredRoles: ["student", "writer", "admin"], errorMapper: dynamoErrorMapper },
);

export namespace ListArticleLikes {
  export type UrlParams = { articleId: string };
  export type Response = {
    count: number;
    likes: Array<{ articleId: string; accountId: string; createdAt: string }>;
  };
}
