import { createRouter, createRoute, createRootRoute, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/router-devtools"
import { SigninView } from "./features/auth/signin/SigninView"
import { SignupView } from "./features/auth/signup/SignupView"

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

const signinRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signin",
  component: SigninView,
})

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: SignupView,
})

const routeTree = rootRoute.addChildren([indexRoute, signinRoute, signupRoute])

export const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
