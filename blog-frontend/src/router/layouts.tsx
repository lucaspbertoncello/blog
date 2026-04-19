import { AuthLayout } from "@/shared/layouts/AuthLayout";
import { createRoute } from "@tanstack/react-router";
import { publicLayoutRoute, writerLayoutRoute } from "./guards";
import { BaseApplicationLayout } from "@/shared/layouts/BaseApplicationLayout";

export const authLayoutRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/auth",
  component: AuthLayout,
});

export const feedLayoutRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  id: "feed",
  component: BaseApplicationLayout,
});

export const articlesPanelLayoutRoute = createRoute({
  getParentRoute: () => writerLayoutRoute,
  id: "articles-panel",
  component: BaseApplicationLayout,
});
