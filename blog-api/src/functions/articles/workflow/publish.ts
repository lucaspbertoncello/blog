import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { lambdaHttpAdapter } from "../../../adapters/lambdaHttpAdapter";
import { dynamoClient } from "../../../clients/dynamoClient";
import { ApplicationError } from "../../../errors/ApplicationError";
import { dynamoErrorMapper } from "../../../errors/mappers/dynamoErrorMapper";
import { getArticleOrThrow } from "../_shared/getArticleOrThrow";

export const handler = lambdaHttpAdapter<"private", undefined, void, PublishArticle.UrlParams>(
  async ({ params }) => {
    const articleId = params.articleId;
    const article = await getArticleOrThrow(articleId);

    if (article.status !== "in_review") {
      throw new ApplicationError("Apenas artigos em revisão podem ser publicados");
    }

    const now = new Date().toISOString();

    const updateCommand = new UpdateCommand({
      TableName: process.env.TABLE_NAME,
      Key: { PK: `ARTICLE#${articleId}`, SK: "INFO" },
      UpdateExpression: "SET #status = :status, GSI2SK = :gsi2sk, updatedAt = :updatedAt",
      ConditionExpression: "#status = :in_review",
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: {
        ":status": "published",
        ":gsi2sk": `STATUS#published#CREATED_AT#${article.createdAt}`,
        ":updatedAt": now,
        ":in_review": "in_review",
      },
    });

    await dynamoClient.send(updateCommand);

    return { statusCode: 200 };
  },
  { requiredRoles: ["admin"], errorMapper: dynamoErrorMapper },
);

export namespace PublishArticle {
  export type UrlParams = { articleId: string };
}
