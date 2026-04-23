export type ArticleLike = {
  articleId: string;
  accountId: string;
  createdAt: string;
};

export type ArticleLikes = {
  count: number;
  likes: ArticleLike[];
};
