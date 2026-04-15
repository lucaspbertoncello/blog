import { z } from "zod";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { lambdaHttpAdapter } from "../../adapters/lambdaHttpAdapter";
import { dynamoClient } from "../../clients/dynamoClient";
import { ApplicationError } from "../../errors/ApplicationError";
import { dynamoErrorMapper } from "../../errors/mappers/dynamoErrorMapper";

const schema = z.object({
  role: z.enum(["admin", "writer", "student"], {
    error: "Role inválida. Valores aceitos: admin, writer, student",
  }),
});

export const handler = lambdaHttpAdapter<"private", SetUserRole.Params, void, SetUserRole.UrlParams>(
  async ({ body, params }) => {
    const accountId = params.accountId;

    const getCommand = new GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: { PK: `ACCOUNT#${accountId}`, SK: "INFO" },
    });

    const { Item } = await dynamoClient.send(getCommand);

    if (!Item) {
      throw new ApplicationError("Usuário não encontrado");
    }

    const updateCommand = new UpdateCommand({
      TableName: process.env.TABLE_NAME,
      Key: { PK: `ACCOUNT#${accountId}`, SK: "INFO" },
      UpdateExpression: "SET #role = :role, updatedAt = :updatedAt",
      ExpressionAttributeNames: { "#role": "role" },
      ExpressionAttributeValues: {
        ":role": body.role,
        ":updatedAt": new Date().toISOString(),
      },
    });

    await dynamoClient.send(updateCommand);

    return { statusCode: 200 };
  },
  { schema, requiredRoles: ["admin"], errorMapper: dynamoErrorMapper },
);

export namespace SetUserRole {
  export type Params = z.infer<typeof schema>;
  export type UrlParams = { accountId: string };
}
