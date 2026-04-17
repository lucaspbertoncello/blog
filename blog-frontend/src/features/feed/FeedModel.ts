import { useState } from "react"
import { MOCK_ARTICLES } from "./mock-data"

export function useFeedModel() {
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())

  function toggleLike(articleId: string) {
    setLikedIds((prev) => {
      const next = new Set(prev)
      next.has(articleId) ? next.delete(articleId) : next.add(articleId)
      return next
    })
  }

  return { articles: MOCK_ARTICLES, likedIds, toggleLike }
}
