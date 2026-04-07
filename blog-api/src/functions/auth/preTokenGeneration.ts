import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { PreTokenGenerationV2TriggerEvent } from "aws-lambda";
import { dynamoClient } from "../../clients/dynamoClient";

export const handler = async (event: PreTokenGenerationV2TriggerEvent) => {
  const { sub } = event.request.userAttributes;

  const { Item } = await dynamoClient.send(
    new GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        PK: `ACCOUNT#${sub}`,
        SK: "INFO",
      },
      ProjectionExpression: "#role",
      ExpressionAttributeNames: { "#role": "role" },
    }),
  );

  const role = Item?.role ?? "student";

  event.response = {
    claimsAndScopeOverrideDetails: {
      accessTokenGeneration: {
        claimsToAddOrOverride: { role },
      },
      idTokenGeneration: {
        claimsToAddOrOverride: { role },
      },
    },
  };

  return event;
};
