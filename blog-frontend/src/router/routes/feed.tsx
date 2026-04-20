import { createRoute } from "@tanstack/react-router";
import { feedLayoutRoute } from "../layouts";
import { FeedViewModel } from "@/features/feed/FeedViewModel";
import { ArticlePageViewModel } from "@/features/articlePage/ArticlePageViewModel";

export const feedRoute = createRoute({
  getParentRoute: () => feedLayoutRoute,
  path: "/",
  component: FeedViewModel,
});

export const articlePageRoute = createRoute({
  getParentRoute: () => feedLayoutRoute,
  path: "/articles/$articleSlug",
  component: ArticlePageViewModel,
});
