import { type UserStore, useUserStore } from "@/domain/users/stores/useUserStore";
import { Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export function createRoleGuard(selector: (state: UserStore) => boolean) {
  return function RoleGuard() {
    const account = useUserStore((state) => state.account);
    const hasAccess = useUserStore(selector);
    const navigate = useNavigate();

    // account null = still loading (ProtectedLayoutGuard is fetching /me).
    // Only redirect after account is known — avoids false redirect on refresh.
    useEffect(() => {
      if (account !== null && !hasAccess) {
        navigate({ to: "/" });
      }
    }, [account, hasAccess, navigate]);

    if (account === null || !hasAccess) return null;

    return <Outlet />;
  };
}
