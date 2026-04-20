import { createRoute, redirect } from "@tanstack/react-router";
import { authLayoutRoute } from "../layouts";
import { SigninViewModel } from "@/features/auth/signin/SigninViewModel";
import { SignupViewModel } from "@/features/auth/signup/SignupViewModel";
import { VerifyCodeViewModel } from "@/features/auth/verify-code/VerifyCodeViewModel";
import z from "zod";

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
