import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { lambdaHttpAdapter } from "../../../adapters/lambdaHttpAdapter";
import { dynamoClient } from "../../../clients/dynamoClient";
import { dynamoErrorMapper } from "../../../errors/mappers/dynamoErrorMapper";
import { Comment } from "../../../types/Article";
import { getArticleOrThrow } from "../_shared/getArticleOrThrow";

export const handler = lambdaHttpAdapter<
  "private",
  undefined,
  ListArticleComments.Response,
  ListArticleComments.UrlParams
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
          ":skPrefix": "COMMENT#",
        },
        ProjectionExpression: "commentId, accountId, articleId, content, createdAt, updatedAt",
      }),
    );

    return {
      statusCode: 200,
      body: {
        count: Count ?? 0,
        comments: (Items ?? []) as Comment[],
      },
    };
  },
  { requiredRoles: ["student", "writer", "admin"], errorMapper: dynamoErrorMapper },
);

export namespace ListArticleComments {
  export type UrlParams = { articleId: string };
  export type Response = {
    count: number;
    comments: Comment[];
  };
}
