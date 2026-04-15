import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { lambdaHttpAdapter } from "../../adapters/lambdaHttpAdapter";
import { Article } from "../../types/Article";
import { dynamoClient } from "../../clients/dynamoClient";

export const handler = lambdaHttpAdapter<"private", undefined, ListAllArticles.Response>(
  async () => {
    const command = new QueryCommand({
      TableName: process.env.TABLE_NAME,
      IndexName: "GSI2",
      KeyConditionExpression: "GSI2PK = :pk",
      ExpressionAttributeValues: {
        ":pk": "ARTICLES",
      },
      ProjectionExpression: "articleId, title, #status, slug, visibility, tags, createdAt, updatedAt",
      ExpressionAttributeNames: {
        "#status": "status",
      },
    });

    const { Items, Count } = await dynamoClient.send(command);

    return {
      statusCode: 201,
      body: { count: Count ?? 0, articles: (Items as Array<Omit<Article, "content">>) ?? [] },
    };
  },

  {
    requiredRoles: ["admin"],
  },
);

export namespace ListAllArticles {
  export type Response = {
    articles: Array<Omit<Article, "content">>;
    count: number;
  };
}
