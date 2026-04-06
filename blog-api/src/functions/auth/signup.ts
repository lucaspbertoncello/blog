import z from "zod";
import { lambdaHttpAdapter } from "../../adapters/lambdaHttpAdapter";
import { SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient } from "../../clients/cognitoClient";
import { ApplicationError } from "../../errors/ApplicationError";
import { cognitoErrorMapper } from "../../errors/mappers/cognitoErrorMapper";

const schema = z.object({
  email: z.email({ error: "E-mail inválido" }),
  password: z.string({ error: "Senha inválida" }).min(8),
});

export const handler = lambdaHttpAdapter<"public", Signup.Params, Signup.Response>(
  async ({ body }) => {
    const command = new SignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: body.email,
      Password: body.password,
    });

    const { CodeDeliveryDetails } = await cognitoClient.send(command);

    if (!CodeDeliveryDetails?.Destination) {
      throw new ApplicationError(`Ocorreu um erro ao enviar o código para o email ${body.email}`);
    }

    return { body: { codeDeliveryMessage: CodeDeliveryDetails?.Destination }, statusCode: 200 };
  },
  { schema, errorMapper: cognitoErrorMapper },
);

export namespace Signup {
  export type Params = z.infer<typeof schema>;
  export type Response = { codeDeliveryMessage: string };
}
