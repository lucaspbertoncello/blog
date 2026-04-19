import { createRoute, redirect } from "@tanstack/react-router";
import { rootRoute } from ".";
import { PublicRouteLayout } from "@/shared/guards/PublicRouteLayout";
import { ProtectedRouteGuard } from "@/shared/guards/ProtectedRouteLayout";
import { useAuthStore } from "@/domain/auth/stores/useAuthStore";

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
