import axios from "axios";
import { httpClient } from "@/shared/lib/httpClient";
import {
  buildFileUploadFormData,
  buildUploadedFileUrl,
  validateUploadFileSize,
  validateUploadFileType,
} from "@/shared/lib/fileUpload";
import type {
  ArticleImageFileType,
  ArticleImageUploadPresignedPost,
  ArticleImageUploadResult,
} from "../types/ArticleImageUpload";

const MAX_ARTICLE_IMAGE_SIZE = 3 * 1024 * 1024;
const ALLOWED_ARTICLE_IMAGE_TYPES: ArticleImageFileType[] = ["image/png", "image/jpeg"];

function assertIsValidArticleImage(file: File): asserts file is File & { type: ArticleImageFileType } {
  validateUploadFileType(file, ALLOWED_ARTICLE_IMAGE_TYPES, "Tipo de arquivo invalido. Permitido: PNG e JPEG");
  validateUploadFileSize(file, { maxSizeInBytes: MAX_ARTICLE_IMAGE_SIZE });
}

export async function uploadArticleImage(params: UploadArticleImageService.Params) {
  const { file } = params;

  assertIsValidArticleImage(file);

  const { data: presignedPost } = await httpClient.post<ArticleImageUploadPresignedPost>("/uploads/presigned-post", {
    fileType: file.type,
    fileSize: file.size,
  });

  const key = presignedPost.fields.key;
  if (!key) {
    throw new Error("A resposta do upload nao retornou a chave do arquivo");
  }

  await axios.post(presignedPost.url, buildFileUploadFormData(presignedPost.fields, file));

  return {
    key,
    fileUrl: buildUploadedFileUrl(presignedPost.url, key),
    contentType: file.type,
    size: file.size,
  } satisfies ArticleImageUploadResult;
}

export namespace UploadArticleImageService {
  export type Params = { file: File };
  export type Response = ArticleImageUploadResult;
}
