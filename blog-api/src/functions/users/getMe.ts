import { lambdaHttpAdapter } from "../../adapters/lambdaHttpAdapter";
import { dynamoClient } from "../../clients/dynamoClient";
import { ApplicationError } from "../../errors/ApplicationError";
import { Role } from "../../types/Roles";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

export const handler = lambdaHttpAdapter<"private", undefined, GetMe.Response>(async ({ accountId }) => {
  const command = new GetCommand({
    TableName: process.env.TABLE_NAME,
    Key: {
      PK: `ACCOUNT#${accountId}`,
      SK: "INFO",
    },
    ProjectionExpression: "accountId, email, #role, active, createdAt, updatedAt",
    ExpressionAttributeNames: { "#role": "role" },
  });

  const { Item } = await dynamoClient.send(command);

  if (!Item) {
    throw new ApplicationError("Usuário não encontrado");
  }

  return {
    statusCode: 200,
    body: {
      accountId: Item.accountId,
      email: Item.email,
      active: Item.active,
      createdAt: Item.createdAt,
      role: Item.role,
      updatedAt: Item.updatedAt,
    },
  };
});

export namespace GetMe {
  export type Response = {
    accountId: string;
    email: string;
    role: Role;
    active: boolean;
    createdAt: string;
    updatedAt: string;
  };
}
