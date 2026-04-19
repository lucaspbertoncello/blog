import { Toaster } from "@/shared/components/common/sonner";
import { queryClient } from "@/shared/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, createRouter, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { protectedLayoutRoute, publicLayoutRoute, writerLayoutRoute } from "./guards";
import { articlesPanelLayoutRoute, authLayoutRoute, feedLayoutRoute } from "./layouts";
import {
  articleEditorEditRoute,
  articleEditorNewRoute,
  articlePageRoute,
  articlesPanelRoute,
  feedRoute,
  signinRoute,
  signupRoute,
  verifyCodeRoute,
} from "./routes";

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
    authLayoutRoute.addChildren([signinRoute, signupRoute, verifyCodeRoute]),
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
