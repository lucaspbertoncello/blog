import { createRoute, redirect } from "@tanstack/react-router";
import { adminPanelLayoutRoute } from "../layouts";
import { AdminArticlesView } from "@/features/adminPanel/articles/AdminArticlesView";
import { AdminUsersView } from "@/features/adminPanel/users/AdminUsersView";
import { AdminCommentsView } from "@/features/adminPanel/comments/AdminCommentsView";

export const adminIndexRoute = createRoute({
  getParentRoute: () => adminPanelLayoutRoute,
  path: "/admin",
  beforeLoad: () => {
    throw redirect({ to: "/admin/articles" });
  },
});

export const adminArticlesRoute = createRoute({
  getParentRoute: () => adminPanelLayoutRoute,
  path: "/admin/articles",
  component: AdminArticlesView,
});

export const adminUsersRoute = createRoute({
  getParentRoute: () => adminPanelLayoutRoute,
  path: "/admin/users",
  component: AdminUsersView,
});

export const adminCommentsRoute = createRoute({
  getParentRoute: () => adminPanelLayoutRoute,
  path: "/admin/comments",
  component: AdminCommentsView,
});
