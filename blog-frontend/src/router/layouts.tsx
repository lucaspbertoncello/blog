import { AuthLayout } from "@/shared/layouts/AuthLayout";
import { createRoute } from "@tanstack/react-router";
import { authGuardRoute, publicLayoutRoute, writerLayoutRoute, adminLayoutRoute } from "./guards";
import { BaseApplicationLayout } from "@/shared/layouts/BaseApplicationLayout";
import { AdminPanelLayout } from "@/features/adminPanel/AdminPanelLayout";

export const authLayoutRoute = createRoute({
  getParentRoute: () => authGuardRoute,
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

export const adminPanelLayoutRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  id: "admin-panel",
  component: AdminPanelLayout,
});
