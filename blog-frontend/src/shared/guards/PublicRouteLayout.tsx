import { useAuthStore } from "@/domain/auth/stores/useAuthStore";
import { useGetMe } from "@/domain/users/hooks/useGetMe";
import { useUserStore } from "@/domain/users/stores/useUserStore";
import { Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";

export function PublicRouteLayout() {
  const { data, isError } = useGetMe();

  const clearAuthTokens = useAuthStore((state) => state.clearAuthTokens);
  const setAccountData = useUserStore((state) => state.setAccountData);

  useEffect(() => {
    if (isError) {
      clearAuthTokens();
      toast.error("Faça login novamente");
      return;
    }

    if (data) {
      setAccountData({ account: data });
    }
  }, [isError, clearAuthTokens, data, setAccountData]);

  return <Outlet />;
}
