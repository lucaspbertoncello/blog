export type Article = {
  articleId: string;
  accountId: string;
  title: string;
  slug: string;
  tags: string[];
  visibility: "public" | "students_only";
  createdAt: string;
  updatedAt: string;
  status: "published" | "in_review" | "approved" | "rejected";
  // mock-only fields (not returned by API)
  authorName: string;
  likeCount: number;
  commentCount: number;
};
