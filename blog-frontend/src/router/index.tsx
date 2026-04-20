import { Toaster } from "@/shared/components/common/sonner";
import { queryClient } from "@/shared/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, createRouter, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { authGuardRoute, protectedLayoutRoute, publicLayoutRoute, writerLayoutRoute } from "./guards";
import { articlesPanelLayoutRoute, authLayoutRoute, feedLayoutRoute } from "./layouts";
import { signinRoute, signupRoute, verifyCodeRoute } from "./routes/auth";
import { feedRoute, articlePageRoute } from "./routes/feed";
import { articlesPanelRoute, articleEditorNewRoute, articleEditorEditRoute } from "./routes/writerPanel";

export const rootRoute = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </QueryClientProvider>
  ),
});

const routeTree = rootRoute.addChildren([
  publicLayoutRoute.addChildren([
    feedLayoutRoute.addChildren([feedRoute, articlePageRoute]),
    authGuardRoute.addChildren([
      authLayoutRoute.addChildren([signinRoute, signupRoute, verifyCodeRoute]),
    ]),
  ]),
  protectedLayoutRoute.addChildren([
    writerLayoutRoute.addChildren([
      articlesPanelLayoutRoute.addChildren([articlesPanelRoute, articleEditorNewRoute, articleEditorEditRoute]),
    ]),
  ]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
