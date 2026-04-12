import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { PostConfirmationTriggerEvent } from "aws-lambda";
import { dynamoClient } from "../../clients/dynamoClient";

export const handler = async (event: PostConfirmationTriggerEvent) => {
  const { email, sub } = event.request.userAttributes;

  const now = new Date().toISOString();

  const command = new PutCommand({
    TableName: process.env.TABLE_NAME,
    Item: {
      PK: `ACCOUNT#${sub}`,
      SK: "INFO",
      GSI1PK: `EMAIL#${email}`,
      GSI1SK: `ACCOUNT#${sub}`,
      GSI2PK: "ACCOUNTS",
      GSI2SK: `CREATED_AT#${now}`,
      accountId: sub,
      email,
      role: "student",
      active: true,
      createdAt: now,
      updatedAt: now,
    },
  });

  const response = await dynamoClient.send(command);
  console.log(response);

  return event;
};
