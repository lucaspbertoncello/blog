import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { randomUUID } from "crypto";
import { z } from "zod";
import { lambdaHttpAdapter } from "../../adapters/lambdaHttpAdapter";
import { s3Client } from "../../clients/s3Client";
import { s3ErrorMapper } from "../../errors/mappers/s3ErrorMapper";

const MAX_FILE_SIZE = 3 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg"] as const;

const schema = z.object({
  fileType: z.enum(ALLOWED_TYPES, { error: "Tipo de arquivo inválido. Permitido: PNG e JPEG" }),
  fileSize: z
    .number({ error: "Tamanho do arquivo inválido" })
    .min(1, "Arquivo não pode estar vazio")
    .max(MAX_FILE_SIZE, "Arquivo deve ter no máximo 3MB"),
});

export const handler = lambdaHttpAdapter<
  "private",
  GeneratePresignedPost.Params,
  GeneratePresignedPost.Response
>(
  async ({ body, accountId }) => {
    const { fileType, fileSize } = body;

    const ext = fileType === "image/png" ? "png" : "jpg";
    const key = `uploads/${accountId}/${randomUUID()}.${ext}`;

    const { url, fields } = await createPresignedPost(s3Client, {
      Bucket: process.env.BUCKET_NAME!,
      Key: key,
      Conditions: [
        ["content-length-range", fileSize, fileSize],
        ["eq", "$Content-Type", fileType],
      ],
      Fields: {
        "Content-Type": fileType,
      },
      Expires: 300,
    });

    return { statusCode: 200, body: { url, fields } };
  },
  { schema, requiredRoles: ["writer", "admin"], errorMapper: s3ErrorMapper },
);

export namespace GeneratePresignedPost {
  export type Params = z.infer<typeof schema>;
  export type Response = { url: string; fields: Record<string, string> };
}
