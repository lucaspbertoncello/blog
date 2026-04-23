import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { lambdaHttpAdapter } from "../../../adapters/lambdaHttpAdapter";
import { dynamoClient } from "../../../clients/dynamoClient";
import { dynamoErrorMapper } from "../../../errors/mappers/dynamoErrorMapper";
import { Comment } from "../../../types/Article";

export const handler = lambdaHttpAdapter<"private", undefined, ListAccountComments.Response, ListAccountComments.UrlParams>(
  async ({ params }) => {
    const { accountId } = params;

    const { Items, Count } = await dynamoClient.send(new QueryCommand({
      TableName: process.env.TABLE_NAME,
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :pk AND begins_with(GSI1SK, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": `ACCOUNT#${accountId}`,
        ":skPrefix": "COMMENT#",
      },
      ProjectionExpression: "commentId, accountId, articleId, content, createdAt, updatedAt",
    }));

    return {
      statusCode: 200,
      body: {
        count: Count ?? 0,
        comments: (Items ?? []) as Comment[],
      },
    };
  },
  { requiredRoles: ["admin"], errorMapper: dynamoErrorMapper },
);

export namespace ListAccountComments {
  export type UrlParams = { accountId: string };
  export type Response = {
    count: number;
    comments: Comment[];
  };
}
