import { createRouter, createRoute, createRootRoute, Outlet, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthLayout } from "./shared/layouts/AuthLayout";
import { SigninViewModel } from "./features/auth/signin/SigninViewModel";
import { SignupViewModel } from "./features/auth/signup/SignupViewModel";
import { VerifyCodeViewModel } from "./features/auth/verify-code/VerifyCodeViewModel";
import { queryClient } from "./shared/lib/queryClient";
import { Toaster } from "./shared/components/common/sonner";
import { useAuthStore } from "./domain/auth/stores/useAuthStore";
import { FeedView } from "./features/feed/FeedView";

const rootRoute = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </QueryClientProvider>
  ),
});

// -> guards <-
const authLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "auth",
  component: AuthLayout,
  beforeLoad: () => {
    if (useAuthStore.getState().isAuthenticated()) {
      throw redirect({ to: "/" });
    }
  },
});

const protectedLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  component: () => <Outlet />,
  beforeLoad: ({ location }) => {
    if (!useAuthStore.getState().isAuthenticated()) {
      throw redirect({ to: "/signin", search: { redirect: location.href } });
    }
  },
});
// -> guards <-

// -> auth routes <-
const signinRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "/signin",
  component: SigninViewModel,
});

const signupRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "/signup",
  component: SignupViewModel,
});

const verifyCodeRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "/verify-code",
  validateSearch: z.object({ email: z.string().optional() }),
  beforeLoad: ({ search }) => {
    if (!z.string().email().safeParse(search.email).success) {
      throw redirect({ to: "/signup" });
    }
  },
  component: VerifyCodeViewModel,
});
// -> auth routes <-

// -> feed routes <-
const feedRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: "/",
  component: FeedView,
});
// -> feed routes <-

const routeTree = rootRoute.addChildren([
  authLayoutRoute.addChildren([signinRoute, signupRoute, verifyCodeRoute]),
  protectedLayoutRoute.addChildren([feedRoute]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
