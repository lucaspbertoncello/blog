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
import { FeedViewModel } from "./features/feed/FeedViewModel";
import { ProtectedRouteGuard } from "./shared/guards/ProtectedRouteLayout";
import { PublicRouteLayout } from "./shared/guards/PublicRouteLayout";
import { ArticlePageViewModel } from "./features/articlePage/ArticlePageViewModel";

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
const publicLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "public",
  component: PublicRouteLayout,
  // beforeLoad: () => {
  //   if (useAuthStore.getState().isAuthenticated()) {
  //     throw redirect({ to: "/" });
  //   }
  // },
});

const protectedLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  component: ProtectedRouteGuard,
  beforeLoad: ({ location }) => {
    if (!useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: "/auth/signin", search: { redirect: location.href } });
    }
  },
});
// -> guards <-

// -> layouts <-
const authLayoutRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/auth",
  component: AuthLayout,
});
// -> layouts <-

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
      throw redirect({ to: "/auth/signup" });
    }
  },
  component: VerifyCodeViewModel,
});
// -> auth routes <-

// -> feed routes <-
const feedRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/",
  component: FeedViewModel,
});

const articlePageRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/articles/$articleSlug",
  component: ArticlePageViewModel,
});
// -> feed routes <-

const routeTree = rootRoute.addChildren([
  publicLayoutRoute.addChildren([
    feedRoute,
    articlePageRoute,
    authLayoutRoute.addChildren([signinRoute, signupRoute, verifyCodeRoute]),
  ]),
  protectedLayoutRoute.addChildren([]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
