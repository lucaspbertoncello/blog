import { createRouter, createRoute, createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthLayout } from "./shared/layouts/AuthLayout";
import { SigninViewModel } from "./features/auth/signin/SigninViewModel";
import { SignupViewModel } from "./features/auth/signup/SignupViewModel";
import { VerifyCodeViewModel } from "./features/auth/verify-code/VerifyCodeViewModel";
import { queryClient } from "./shared/lib/queryClient";
import { Toaster } from "./shared/components/common/sonner";

const rootRoute = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </QueryClientProvider>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
});

const authLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "auth",
  component: AuthLayout,
});

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
  component: VerifyCodeViewModel,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  authLayoutRoute.addChildren([signinRoute, signupRoute, verifyCodeRoute]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
