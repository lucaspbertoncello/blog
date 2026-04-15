import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { lambdaHttpAdapter } from "../../adapters/lambdaHttpAdapter";
import { Article, ArticleStatus } from "../../types/Article";
import { dynamoClient } from "../../clients/dynamoClient";
import z from "zod";

const querySchema = z.object({
  status: z.enum(["draft", "in_review", "published", "rejected", "all"]).optional(),
});

export const handler = lambdaHttpAdapter<
  "private",
  undefined,
  ListAllArticles.Response,
  undefined,
  ListAllArticles.QueryParams
>(
  async ({ queryParams }) => {
    const articleStatus = queryParams.status;

    const command = new QueryCommand({
      TableName: process.env.TABLE_NAME,
      IndexName: "GSI2",
      KeyConditionExpression:
        articleStatus !== "all" ? "GSI2PK = :pk AND begins_with(GSI2SK, :skPrefix)" : "GSI2PK = :pk",
      ExpressionAttributeValues: {
        ":pk": "ARTICLES",
        ...(articleStatus !== "all" && { ":skPrefix": `STATUS#${articleStatus}` }),
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
    querySchema,
  },
);

export namespace ListAllArticles {
  export type Response = {
    articles: Array<Omit<Article, "content">>;
    count: number;
  };

  export type QueryParams = z.infer<typeof querySchema>;
}
