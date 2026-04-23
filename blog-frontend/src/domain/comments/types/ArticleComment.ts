export type ArticleComment = {
  commentId: string;
  articleId: string;
  accountId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type ArticleComments = {
  count: number;
  comments: ArticleComment[];
};
