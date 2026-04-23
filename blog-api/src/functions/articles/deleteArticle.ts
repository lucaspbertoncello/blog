import { BatchWriteCommand, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { lambdaHttpAdapter } from "../../adapters/lambdaHttpAdapter";
import { dynamoClient } from "../../clients/dynamoClient";
import { ApplicationError } from "../../errors/ApplicationError";
import { dynamoErrorMapper } from "../../errors/mappers/dynamoErrorMapper";

export const handler = lambdaHttpAdapter<"private", undefined, void, DeleteArticle.UrlParams>(
  async ({ params, accountId, role }) => {
    const { articleId } = params;

    const { Item } = await dynamoClient.send(
      new GetCommand({
        TableName: process.env.TABLE_NAME,
        Key: { PK: `ARTICLE#${articleId}`, SK: "INFO" },
      }),
    );

    if (!Item) {
      throw new ApplicationError("Artigo não encontrado");
    }

    if (role === "writer" && Item.accountId !== accountId) {
      throw new ApplicationError("Sem permissão para excluir este artigo");
    }

    if (role === "writer" && Item.status !== "draft" && Item.status !== "rejected") {
      throw new ApplicationError("Artigo só pode ser excluído quando está em rascunho ou rejeitado");
    }

    const { Items: allItems } = await dynamoClient.send(
      new QueryCommand({
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: "PK = :pk",
        ExpressionAttributeValues: { ":pk": `ARTICLE#${articleId}` },
        ProjectionExpression: "PK, SK",
      }),
    );

    const items = [
      ...(allItems ?? []),
      { PK: `SLUG#${Item.slug}`, SK: "INFO" },
    ];

    for (let i = 0; i < items.length; i += 25) {
      let unprocessed = items.slice(i, i + 25).map((item) => ({
        DeleteRequest: { Key: { PK: item.PK, SK: item.SK } },
      }));

      while (unprocessed.length > 0) {
        const { UnprocessedItems } = await dynamoClient.send(
          new BatchWriteCommand({
            RequestItems: { [process.env.TABLE_NAME!]: unprocessed },
          }),
        );
        unprocessed = (UnprocessedItems?.[process.env.TABLE_NAME!] ?? []) as typeof unprocessed;
      }
    }

    return { statusCode: 200 };
  },
  { requiredRoles: ["writer", "admin"], errorMapper: dynamoErrorMapper },
);

export namespace DeleteArticle {
  export type UrlParams = { articleId: string };
}
