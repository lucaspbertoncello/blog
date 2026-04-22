import { createRoute, redirect } from "@tanstack/react-router";
import { rootRoute } from ".";
import { PublicLayoutGuard } from "@/shared/guards/PublicLayoutGuard";
import { ProtectedLayoutGuard } from "@/shared/guards/ProtectedLayoutGuard";
import { WriterLayoutGuard } from "@/shared/guards/WriterLayoutGuard";
import { AdminLayoutGuard } from "@/shared/guards/AdminLayoutGuard";
import { useAuthStore } from "@/domain/auth/stores/useAuthStore";

export const publicLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "public",
  component: PublicLayoutGuard,
});

export const protectedLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  component: ProtectedLayoutGuard,
  beforeLoad: ({ location }) => {
    if (!useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: "/auth/signin", search: { redirect: location.href } });
    }
  },
});

export const authGuardRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  id: "auth-guard",
  beforeLoad: () => {
    if (useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
});

export const writerLayoutRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  id: "writer",
  component: WriterLayoutGuard,
});

export const adminLayoutRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  id: "admin",
  component: AdminLayoutGuard,
});
