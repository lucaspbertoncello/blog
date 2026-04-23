import { createRoute, redirect } from "@tanstack/react-router";
import { adminPanelLayoutRoute } from "../layouts";
import { AdminPanelViewModel } from "@/features/adminPanel/AdminPanelViewModel";

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
  component: AdminPanelViewModel,
});

export const adminUsersRoute = createRoute({
  getParentRoute: () => adminPanelLayoutRoute,
  path: "/admin/users",
  component: AdminPanelViewModel,
});
