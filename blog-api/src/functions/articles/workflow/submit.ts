import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { lambdaHttpAdapter } from "../../../adapters/lambdaHttpAdapter";
import { dynamoClient } from "../../../clients/dynamoClient";
import { ApplicationError } from "../../../errors/ApplicationError";
import { dynamoErrorMapper } from "../../../errors/mappers/dynamoErrorMapper";
import { assertWriterOwnsArticle } from "../_shared/assertWriterOwnsArticle";
import { getArticleOrThrow } from "../_shared/getArticleOrThrow";

export const handler = lambdaHttpAdapter<"private", undefined, void, SubmitArticle.UrlParams>(
  async ({ params, accountId, role }) => {
    const articleId = params.articleId;
    const article = await getArticleOrThrow(articleId);

    if (article.status !== "draft" && article.status !== "rejected") {
      throw new ApplicationError("Apenas artigos em rascunho ou rejeitados podem ser submetidos para revisão");
    }

    assertWriterOwnsArticle({
      article,
      accountId,
      role,
      message: "Você não tem permissão para submeter este artigo",
    });

    const now = new Date().toISOString();

    const updateCommand = new UpdateCommand({
      TableName: process.env.TABLE_NAME,
      Key: { PK: `ARTICLE#${articleId}`, SK: "INFO" },
      UpdateExpression: "SET #status = :status, GSI2SK = :gsi2sk, updatedAt = :updatedAt",
      ConditionExpression: "#status = :draft OR #status = :rejected",
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: {
        ":status": "in_review",
        ":gsi2sk": `STATUS#in_review#CREATED_AT#${article.createdAt}`,
        ":updatedAt": now,
        ":draft": "draft",
        ":rejected": "rejected",
      },
    });

    await dynamoClient.send(updateCommand);

    return { statusCode: 200 };
  },
  { requiredRoles: ["writer", "admin"], errorMapper: dynamoErrorMapper },
);

export namespace SubmitArticle {
  export type UrlParams = { articleId: string };
}
