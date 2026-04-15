import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { lambdaHttpAdapter } from "../../adapters/lambdaHttpAdapter";
import { dynamoClient } from "../../clients/dynamoClient";
import { ApplicationError } from "../../errors/ApplicationError";
import { dynamoErrorMapper } from "../../errors/mappers/dynamoErrorMapper";

export const handler = lambdaHttpAdapter<"private", undefined, void>(
  async ({ params }) => {
    const articleId = params.articleId;

    const getCommand = new GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: { PK: `ARTICLE#${articleId}`, SK: "INFO" },
    });

    const { Item } = await dynamoClient.send(getCommand);

    if (!Item) {
      throw new ApplicationError("Artigo não encontrado");
    }

    if (Item.status !== "in_review") {
      throw new ApplicationError("Apenas artigos em revisão podem ser rejeitados");
    }

    const now = new Date().toISOString();

    const updateCommand = new UpdateCommand({
      TableName: process.env.TABLE_NAME,
      Key: { PK: `ARTICLE#${articleId}`, SK: "INFO" },
      UpdateExpression: "SET #status = :status, GSI2SK = :gsi2sk, updatedAt = :updatedAt",
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: {
        ":status": "rejected",
        ":gsi2sk": `STATUS#rejected#CREATED_AT#${Item.createdAt}`,
        ":updatedAt": now,
      },
    });

    await dynamoClient.send(updateCommand);

    return { statusCode: 200 };
  },
  { requiredRoles: ["admin"], errorMapper: dynamoErrorMapper },
);
