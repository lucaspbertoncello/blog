export type ArticleImageFileType = "image/png" | "image/jpeg";

export type ArticleImageUploadPresignedPost = {
  url: string;
  fields: Record<string, string>;
};

export type ArticleImageUploadResult = {
  key: string;
  fileUrl: string;
  contentType: ArticleImageFileType;
  size: number;
};
