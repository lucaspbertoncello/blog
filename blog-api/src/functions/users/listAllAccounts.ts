import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { lambdaHttpAdapter } from "../../adapters/lambdaHttpAdapter";
import { dynamoClient } from "../../clients/dynamoClient";
import { Role } from "../../types/Roles";

export const handler = lambdaHttpAdapter<"private", undefined, ListAllAccounts.Response>(
  async () => {
    const command = new QueryCommand({
      TableName: process.env.TABLE_NAME,
      IndexName: "GSI2",
      KeyConditionExpression: "GSI2PK = :pk",
      ExpressionAttributeValues: { ":pk": "ACCOUNTS" },
      ProjectionExpression: "accountId, email, #role, active, createdAt, updatedAt",
      ExpressionAttributeNames: { "#role": "role" },
    });

    const { Items, Count } = await dynamoClient.send(command);

    return {
      statusCode: 200,
      body: {
        count: Count ?? 0,
        accounts: (Items as ListAllAccounts.Account[]) ?? [],
      },
    };
  },
  { requiredRoles: ["admin"] },
);

export namespace ListAllAccounts {
  export type Account = {
    accountId: string;
    email: string;
    role: Role;
    active: boolean;
    createdAt: string;
    updatedAt: string;
  };
  export type Response = { count: number; accounts: Account[] };
}
