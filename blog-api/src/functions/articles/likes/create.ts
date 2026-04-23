import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { lambdaHttpAdapter } from "../../../adapters/lambdaHttpAdapter";
import { dynamoClient } from "../../../clients/dynamoClient";
import { ApplicationError } from "../../../errors/ApplicationError";
import { dynamoErrorMapper } from "../../../errors/mappers/dynamoErrorMapper";
import { getArticleOrThrow } from "../_shared/getArticleOrThrow";

export const handler = lambdaHttpAdapter<"private", undefined, void, LikeArticle.UrlParams>(
  async ({ params, accountId }) => {
    const { articleId } = params;

    await getArticleOrThrow(articleId);

    try {
      await dynamoClient.send(
        new PutCommand({
          TableName: process.env.TABLE_NAME,
          Item: {
            PK: `ARTICLE#${articleId}`,
            SK: `LIKE#${accountId}`,
            articleId,
            accountId,
            createdAt: new Date().toISOString(),
          },
          ConditionExpression: "attribute_not_exists(PK)",
        }),
      );
    } catch (err) {
      if (err instanceof Error && err.name === "ConditionalCheckFailedException") {
        throw new ApplicationError("Você já curtiu este artigo");
      }

      throw err;
    }

    return { statusCode: 201 };
  },
  { requiredRoles: ["student", "writer", "admin"], errorMapper: dynamoErrorMapper },
);

export namespace LikeArticle {
  export type UrlParams = { articleId: string };
}
