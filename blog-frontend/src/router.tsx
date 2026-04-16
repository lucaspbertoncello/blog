import { createRouter, createRoute, createRootRoute, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/router-devtools"
import { AuthLayout } from "./shared/layouts/AuthLayout"
import { SigninView } from "./features/auth/signin/SigninView"
import { SignupViewModel } from "./features/auth/signup/SignupViewModel"
import { VerifyCodeView } from "./features/auth/verify-code/VerifyCodeView"

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <div>Home</div>,
})

const authLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "auth",
  component: AuthLayout,
})

const signinRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "/signin",
  component: SigninView,
})

const signupRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "/signup",
  component: SignupViewModel,
})

const verifyCodeRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "/verify-code",
  component: VerifyCodeView,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  authLayoutRoute.addChildren([signinRoute, signupRoute, verifyCodeRoute]),
])

export const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
