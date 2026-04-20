import { createRoute } from "@tanstack/react-router";
import { articlesPanelLayoutRoute } from "../layouts";
import { ArticlesPanelViewModel } from "@/features/articlesPanel/ArticlesPanelViewModel";
import { ArticleEditorViewModel } from "@/features/articleEditor/ArticleEditorViewModel";

export const articlesPanelRoute = createRoute({
  getParentRoute: () => articlesPanelLayoutRoute,
  path: "/writer/articles",
  component: ArticlesPanelViewModel,
});

export const articleEditorNewRoute = createRoute({
  getParentRoute: () => articlesPanelLayoutRoute,
  path: "/writer/articles/new",
  component: ArticleEditorViewModel,
});

export const articleEditorEditRoute = createRoute({
  getParentRoute: () => articlesPanelLayoutRoute,
  path: "/writer/articles/$articleId/edit",
  component: ArticleEditorViewModel,
});
