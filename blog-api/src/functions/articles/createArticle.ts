import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";
import { z } from "zod";
import { lambdaHttpAdapter } from "../../adapters/lambdaHttpAdapter";
import { dynamoClient } from "../../clients/dynamoClient";
import { dynamoErrorMapper } from "../../errors/mappers/dynamoErrorMapper";
import { ApplicationError } from "../../errors/ApplicationError";

const schema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  content: z.string().min(1, "Conteúdo é obrigatório"),
  slug: z.string().min(1, "Slug é obrigatório"),
  tags: z.array(z.string({ error: "Tag inválida" }), { error: "Tags devem ser uma lista" }),
  visibility: z.enum(["public", "students_only"], { error: "Visibilidade inválida" }),
});

export const handler = lambdaHttpAdapter<"private", CreateArticle.Params, CreateArticle.Response>(
  async ({ body, accountId }) => {
    const articleId = randomUUID();
    const now = new Date().toISOString();

    const slugAlreadyExists = new QueryCommand({
      TableName: process.env.TABLE_NAME,
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :pk",
      ExpressionAttributeValues: {
        ":pk": `SLUG#${body.slug}`,
      },
    });

    const { Count } = await dynamoClient.send(slugAlreadyExists);

    if (Count) {
      throw new ApplicationError("Já existe um artigo com esse nome");
    }

    const command = new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: {
        PK: `ARTICLE#${articleId}`,
        SK: "INFO",
        GSI1PK: `SLUG#${body.slug}`,
        GSI1SK: `ARTICLE#${articleId}`,
        GSI2PK: `ARTICLES`,
        GSI2SK: `STATUS#draft#CREATED_AT#${now}`,
        articleId,
        accountId,
        title: body.title,
        content: body.content,
        tags: body.tags,
        slug: body.slug,
        status: "draft",
        visibility: body.visibility,
        createdAt: now,
        updatedAt: now,
      },
    });

    await dynamoClient.send(command);

    return {
      statusCode: 201,
    };
  },
  { schema: schema, requiredRoles: ["writer", "admin"], errorMapper: dynamoErrorMapper },
);

export namespace CreateArticle {
  export type Params = z.infer<typeof schema>;
  export type Response = void;
}
