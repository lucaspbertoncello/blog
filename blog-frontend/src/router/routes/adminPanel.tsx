import { createRoute, redirect } from "@tanstack/react-router";
import { adminPanelLayoutRoute } from "../layouts";
import { AdminArticlesViewModel } from "@/features/adminPanel/articles/AdminArticlesViewModel";
import { AdminUsersViewModel } from "@/features/adminPanel/users/AdminUsersViewModel";

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
  component: AdminArticlesViewModel,
});

export const adminUsersRoute = createRoute({
  getParentRoute: () => adminPanelLayoutRoute,
  path: "/admin/users",
  component: AdminUsersViewModel,
});
