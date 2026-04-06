import z from "zod";
import { lambdaHttpAdapter } from "../../adapters/lambdaHttpAdapter";
import { ConfirmSignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient } from "../../clients/cognitoClient";
import { cognitoErrorMapper } from "../../errors/mappers/cognitoErrorMapper";

const schema = z.object({
  email: z.email({ error: "E-mail inválido" }),
  code: z.string({ error: "Código de confirmação é obrigatório" }),
});

export const handler = lambdaHttpAdapter<"public", ConfirmCode.Params, ConfirmCode.Response>(
  async ({ body }) => {
    const command = new ConfirmSignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: body.email,
      ConfirmationCode: body.code,
    });

    await cognitoClient.send(command);

    return { statusCode: 200, body: { message: "Conta confirmada com sucesso" } };
  },
  { schema, errorMapper: cognitoErrorMapper },
);

export namespace ConfirmCode {
  export type Params = z.infer<typeof schema>;
  export type Response = { message: string };
}
