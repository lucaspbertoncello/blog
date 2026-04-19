import { AuthLayout } from "@/shared/layouts/AuthLayout";
import { FeedLayout } from "@/shared/layouts/FeedLayout";
import { createRoute } from "@tanstack/react-router";
import { protectedLayoutRoute, publicLayoutRoute } from "./guards";
import { ArticlesPanelLayout } from "@/shared/layouts/ArticlesPanelLayout";

export const authLayoutRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/auth",
  component: AuthLayout,
});

export const feedLayoutRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  id: "feed",
  component: FeedLayout,
});

export const articlesPanelLayoutRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  id: "articles-panel",
  component: ArticlesPanelLayout,
});
