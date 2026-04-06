import z from "zod";
import { lambdaHttpAdapter } from "../../adapters/lambdaHttpAdapter";
import { InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient } from "../../clients/cognitoClient";
import { cognitoErrorMapper } from "../../errors/mappers/cognitoErrorMapper";
import { ApplicationError } from "../../errors/ApplicationError";

const schema = z.object({
  email: z.email({ error: "E-mail inválido" }),
  password: z.string({ error: "Senha é obrigatória" }),
});

export const handler = lambdaHttpAdapter<"public", Signin.Params, Signin.Response>(
  async ({ body }) => {
    const command = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: body.email,
        PASSWORD: body.password,
      },
    });

    const { AuthenticationResult } = await cognitoClient.send(command);

    if (!AuthenticationResult?.AccessToken || !AuthenticationResult.RefreshToken) {
      throw new ApplicationError("Erro ao realizar login");
    }

    return {
      statusCode: 200,
      body: {
        accessToken: AuthenticationResult.AccessToken,
        refreshToken: AuthenticationResult.RefreshToken,
      },
    };
  },
  { schema, errorMapper: cognitoErrorMapper },
);

export namespace Signin {
  export type Params = z.infer<typeof schema>;
  export type Response = { accessToken: string; refreshToken?: string };
}
