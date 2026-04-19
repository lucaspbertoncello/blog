import { createRoute, redirect } from "@tanstack/react-router";
import { articlesPanelLayoutRoute, authLayoutRoute, feedLayoutRoute } from "./layouts";
import { SigninViewModel } from "@/features/auth/signin/SigninViewModel";
import { SignupViewModel } from "@/features/auth/signup/SignupViewModel";
import z from "zod";
import { VerifyCodeViewModel } from "@/features/auth/verify-code/VerifyCodeViewModel";
import { FeedViewModel } from "@/features/feed/FeedViewModel";
import { ArticlePageViewModel } from "@/features/articlePage/ArticlePageViewModel";
import { ArticlesPanelViewModel } from "@/features/articlesPanel/ArticlesPanelViewModel";
import { ArticleEditorViewModel } from "@/features/articleEditor/ArticleEditorViewModel";

// -> auth routes <-
export const signinRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "/signin",
  component: SigninViewModel,
});

export const signupRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "/signup",
  component: SignupViewModel,
});

export const verifyCodeRoute = createRoute({
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
export const feedRoute = createRoute({
  getParentRoute: () => feedLayoutRoute,
  path: "/",
  component: FeedViewModel,
});

export const articlePageRoute = createRoute({
  getParentRoute: () => feedLayoutRoute,
  path: "/articles/$articleSlug",
  component: ArticlePageViewModel,
});
// -> feed routes <-

// -> writer page <-

export const articlesPanelRoute = createRoute({
  getParentRoute: () => articlesPanelLayoutRoute,
  path: "/articles/panel",
  component: ArticlesPanelViewModel,
});

export const articleEditorNewRoute = createRoute({
  getParentRoute: () => articlesPanelLayoutRoute,
  path: "/articles/panel/new",
  component: ArticleEditorViewModel,
});

export const articleEditorEditRoute = createRoute({
  getParentRoute: () => articlesPanelLayoutRoute,
  path: "/articles/panel/$articleId/edit",
  component: ArticleEditorViewModel,
});

// -> writer page <-
