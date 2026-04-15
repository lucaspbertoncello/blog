export type Article = {
  articleId: string;
  accountId: string;
  title: string;
  content: string;
  tags: string[];
  status: ArticleStatus;
  slug: string;
  visibility: ArticleVisibility;
  createdAt: string;
  updatedAt: string;
};

export type ArticleStatus = "draft" | "in_review" | "published" | "rejected";
export type ArticleVisibility = "public" | "students_only";
