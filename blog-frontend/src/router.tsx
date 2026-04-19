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
import { FeedLayout } from "./shared/layouts/FeedLayout";
import { ArticlesPanelLayout } from "./shared/layouts/ArticlesPanelLayout";
import { ArticlesPanelViewModel } from "./features/articlesPanel/ArticlesPanelViewModel";

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

const articlesPanelLayoutRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  id: "articles-panel",
  component: ArticlesPanelLayout,
});

const articlesPanelRoute = createRoute({
  getParentRoute: () => articlesPanelLayoutRoute,
  path: "/articles/panel",
  component: ArticlesPanelViewModel,
});

// -> layouts <-
const authLayoutRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/auth",
  component: AuthLayout,
});

const feedLayoutRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  id: "feed",
  component: FeedLayout,
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
  getParentRoute: () => feedLayoutRoute,
  path: "/",
  component: FeedViewModel,
});

const articlePageRoute = createRoute({
  getParentRoute: () => feedLayoutRoute,
  path: "/articles/$articleSlug",
  component: ArticlePageViewModel,
});
// -> feed routes <-

const routeTree = rootRoute.addChildren([
  publicLayoutRoute.addChildren([
    feedLayoutRoute.addChildren([feedRoute, articlePageRoute]),
    authLayoutRoute.addChildren([signinRoute, signupRoute, verifyCodeRoute]),
  ]),
  protectedLayoutRoute.addChildren([
    articlesPanelLayoutRoute.addChildren([articlesPanelRoute]),
  ]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
