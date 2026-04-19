import { createRoute, redirect } from "@tanstack/react-router";
import { rootRoute } from ".";
import { PublicRouteLayout } from "@/shared/guards/PublicRouteLayout";
import { ProtectedRouteGuard } from "@/shared/guards/ProtectedRouteLayout";
import { useAuthStore } from "@/domain/auth/stores/useAuthStore";
import { useUserStore } from "@/domain/users/stores/useUserStore";

export const publicLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "public",
  component: PublicRouteLayout,
});

export const protectedLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  component: ProtectedRouteGuard,
  beforeLoad: ({ location }) => {
    if (!useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: "/auth/signin", search: { redirect: location.href } });
    }
  },
});

export const writerLayoutRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  id: "writer",
  beforeLoad: () => {
    const hasRequiredRoles =
      useUserStore.getState().hasWriterAccess() || useUserStore.getState().hasAdminAccess();
    if (!hasRequiredRoles) {
      throw redirect({ to: "/" });
    }
  },
});
