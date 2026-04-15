import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { z } from "zod";
import { lambdaHttpAdapter } from "../../adapters/lambdaHttpAdapter";
import { dynamoClient } from "../../clients/dynamoClient";
import { ApplicationError } from "../../errors/ApplicationError";
import { dynamoErrorMapper } from "../../errors/mappers/dynamoErrorMapper";
import { generateSlug } from "../../utils/generateSlug";

const schema = z.object({
  title:      z.string().min(1, "Título não pode ser vazio"),
  content:    z.string().min(1, "Conteúdo não pode ser vazio"),
  tags:       z.array(z.string({ error: "Tag inválida" }), { error: "Tags devem ser uma lista" }),
  visibility: z.enum(["public", "students_only"], { error: "Visibilidade inválida" }),
});

export const handler = lambdaHttpAdapter<"private", EditArticle.Params, void, EditArticle.UrlParams>(
  async ({ body, params, accountId, role }) => {
    const { articleId } = params;

    const { Item } = await dynamoClient.send(new GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: { PK: `ARTICLE#${articleId}`, SK: "INFO" },
    }));

    if (!Item) {
      throw new ApplicationError("Artigo não encontrado");
    }

    if (role === "writer" && Item.accountId !== accountId) {
      throw new ApplicationError("Você não tem permissão para editar este artigo");
    }

    const title = body.title ?? Item.title;
    const slug = generateSlug(title);

    await dynamoClient.send(new UpdateCommand({
      TableName: process.env.TABLE_NAME,
      Key: { PK: `ARTICLE#${articleId}`, SK: "INFO" },
      UpdateExpression: "SET title = :title, slug = :slug, GSI1PK = :gsi1pk, content = :content, tags = :tags, visibility = :visibility, updatedAt = :updatedAt",
      ExpressionAttributeValues: {
        ":title":      title,
        ":slug":       slug,
        ":gsi1pk":     `SLUG#${slug}`,
        ":content":    body.content    ?? Item.content,
        ":tags":       body.tags       ?? Item.tags,
        ":visibility": body.visibility ?? Item.visibility,
        ":updatedAt":  new Date().toISOString(),
      },
    }));

    return { statusCode: 200 };
  },
  { schema, requiredRoles: ["writer", "admin"], errorMapper: dynamoErrorMapper },
);

export namespace EditArticle {
  export type Params = z.infer<typeof schema>;
  export type UrlParams = { articleId: string };
}
