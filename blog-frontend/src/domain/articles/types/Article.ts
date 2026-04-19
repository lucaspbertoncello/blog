export type Article = {
  articleId: string;
  accountId: string;
  title: string;
  content: string;
  slug: string;
  tags: string[];
  visibility: ArticleVisibility;
  createdAt: string;
  updatedAt: string;
  status: ArticleStatus;
};

export type ArticleVisibility = "public" | "students_only";
export type ArticleStatus = "draft" | "in_review" | "published" | "rejected";
