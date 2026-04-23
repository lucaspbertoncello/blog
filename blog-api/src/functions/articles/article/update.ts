import { TransactWriteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { z } from "zod";
import { lambdaHttpAdapter } from "../../../adapters/lambdaHttpAdapter";
import { dynamoClient } from "../../../clients/dynamoClient";
import { dynamoErrorMapper } from "../../../errors/mappers/dynamoErrorMapper";
import { generateSlug } from "../../../utils/generateSlug";
import { assertWriterOwnsArticle } from "../_shared/assertWriterOwnsArticle";
import { getArticleOrThrow } from "../_shared/getArticleOrThrow";

const schema = z.object({
  title: z.string().min(1, "Título não pode ser vazio"),
  content: z.string().min(1, "Conteúdo não pode ser vazio"),
  tags: z.array(z.string({ error: "Tag inválida" }), { error: "Tags devem ser uma lista" }),
  visibility: z.enum(["public", "students_only"], { error: "Visibilidade inválida" }),
});

export const handler = lambdaHttpAdapter<"private", EditArticle.Params, void, EditArticle.UrlParams>(
  async ({ body, params, accountId, role }) => {
    const { articleId } = params;
    const article = await getArticleOrThrow(articleId);

    assertWriterOwnsArticle({
      article,
      accountId,
      role,
      message: "Você não tem permissão para editar este artigo",
    });

    const title = body.title ?? article.title;
    const newSlug = generateSlug(title);
    const oldSlug = article.slug;
    const slugChanged = newSlug !== oldSlug;
    const now = new Date().toISOString();

    if (slugChanged) {
      await dynamoClient.send(
        new TransactWriteCommand({
          TransactItems: [
            {
              Delete: {
                TableName: process.env.TABLE_NAME,
                Key: { PK: `SLUG#${oldSlug}`, SK: "INFO" },
              },
            },
            {
              Put: {
                TableName: process.env.TABLE_NAME,
                Item: { PK: `SLUG#${newSlug}`, SK: "INFO", articleId },
                ConditionExpression: "attribute_not_exists(PK)",
              },
            },
            {
              Update: {
                TableName: process.env.TABLE_NAME,
                Key: { PK: `ARTICLE#${articleId}`, SK: "INFO" },
                UpdateExpression:
                  "SET title = :title, slug = :slug, content = :content, tags = :tags, visibility = :visibility, updatedAt = :updatedAt",
                ExpressionAttributeValues: {
                  ":title": title,
                  ":slug": newSlug,
                  ":content": body.content ?? article.content,
                  ":tags": body.tags ?? article.tags,
                  ":visibility": body.visibility ?? article.visibility,
                  ":updatedAt": now,
                },
              },
            },
          ],
        }),
      );
    } else {
      await dynamoClient.send(
        new UpdateCommand({
          TableName: process.env.TABLE_NAME,
          Key: { PK: `ARTICLE#${articleId}`, SK: "INFO" },
          UpdateExpression:
            "SET title = :title, content = :content, tags = :tags, visibility = :visibility, updatedAt = :updatedAt",
          ExpressionAttributeValues: {
            ":title": title,
            ":content": body.content ?? article.content,
            ":tags": body.tags ?? article.tags,
            ":visibility": body.visibility ?? article.visibility,
            ":updatedAt": now,
          },
        }),
      );
    }

    return { statusCode: 200 };
  },
  { schema, requiredRoles: ["writer", "admin"], errorMapper: dynamoErrorMapper },
);

export namespace EditArticle {
  export type Params = z.infer<typeof schema>;
  export type UrlParams = { articleId: string };
}
