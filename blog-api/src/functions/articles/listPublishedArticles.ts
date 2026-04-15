import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { lambdaHttpAdapter } from "../../adapters/lambdaHttpAdapter";
import { dynamoClient } from "../../clients/dynamoClient";
import { dynamoErrorMapper } from "../../errors/mappers/dynamoErrorMapper";
import { Article } from "../../types/Article";

export const handler = lambdaHttpAdapter<"public", undefined, ListPublishedArticles.Response>(
  async () => {
    const command = new QueryCommand({
      TableName: process.env.TABLE_NAME,
      IndexName: "GSI2",
      KeyConditionExpression: "GSI2PK = :pk AND begins_with(GSI2SK, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": "ARTICLES",
        ":skPrefix": "STATUS#published",
      },
      ProjectionExpression: "articleId, title, slug, visibility, tags, createdAt, updatedAt",
    });

    const { Items, Count } = await dynamoClient.send(command);

    return {
      statusCode: 200,
      body: {
        count: Count ?? 0,
        articles: (Items ?? []) as Array<Omit<Article, "content">>,
      },
    };
  },
  { errorMapper: dynamoErrorMapper },
);

export namespace ListPublishedArticles {
  export type Response = {
    count: number;
    articles: Array<Omit<Article, "content">>;
  };
}
