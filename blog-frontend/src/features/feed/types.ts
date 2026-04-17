export type Article = {
  articleId: string
  title: string
  slug: string
  tags: string[]
  visibility: "public" | "students_only"
  createdAt: string
  // mock-only fields (not returned by API)
  authorName: string
  likeCount: number
  commentCount: number
}
