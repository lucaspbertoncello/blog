import { useAuthStore } from "@/domain/auth/stores/useAuthStore";
import { useGetMe } from "@/domain/users/hooks/useGetMe";
import { useUserStore } from "@/domain/users/stores/useUserStore";
import { Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";

export function ProtectedLayoutGuard() {
  const { data, isError } = useGetMe();
  const navigate = useNavigate();
  const clearAuthTokens = useAuthStore((state) => state.clearAuthTokens);
  const setAccountData = useUserStore((state) => state.setAccountData);

  useEffect(() => {
    if (isError) {
      clearAuthTokens();
      setAccountData({ account: null });
      navigate({ to: "/auth/signin" });
      toast.error("Faça login novamente");
      return;
    }

    if (data) {
      setAccountData({ account: data });
    }
  }, [isError, data, clearAuthTokens, setAccountData, navigate]);

  return <Outlet />;
}
