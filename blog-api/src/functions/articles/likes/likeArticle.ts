import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { lambdaHttpAdapter } from "../../../adapters/lambdaHttpAdapter";
import { dynamoClient } from "../../../clients/dynamoClient";
import { ApplicationError } from "../../../errors/ApplicationError";
import { dynamoErrorMapper } from "../../../errors/mappers/dynamoErrorMapper";

export const handler = lambdaHttpAdapter<"private", undefined, void, LikeArticle.UrlParams>(
  async ({ params, accountId }) => {
    const { articleId } = params;

    const { Item: article } = await dynamoClient.send(new GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: { PK: `ARTICLE#${articleId}`, SK: "INFO" },
    }));

    if (!article) {
      throw new ApplicationError("Artigo não encontrado");
    }

    // o sk do like é LIKE#accountId, então a chave pk+sk é única por usuário+artigo.
    // attribute_not_exists(PK) faz o dynamo recusar a gravação se o item já existir,
    // evitando que o mesmo usuário curta duas vezes sem precisar fazer um get antes.
    // sem isso o putitem simplesmente sobrescreveria o item existente sem reclamar.
    try {
      await dynamoClient.send(new PutCommand({
        TableName: process.env.TABLE_NAME,
        Item: {
          PK: `ARTICLE#${articleId}`,
          SK: `LIKE#${accountId}`,
          articleId,
          accountId,
          createdAt: new Date().toISOString(),
        },
        ConditionExpression: "attribute_not_exists(PK)",
      }));
    } catch (err) {
      if (err instanceof Error && err.name === "ConditionalCheckFailedException") {
        throw new ApplicationError("Você já curtiu este artigo");
      }
      throw err;
    }

    return { statusCode: 201 };
  },
  { requiredRoles: ["student", "writer", "admin"], errorMapper: dynamoErrorMapper },
);

export namespace LikeArticle {
  export type UrlParams = { articleId: string };
}
