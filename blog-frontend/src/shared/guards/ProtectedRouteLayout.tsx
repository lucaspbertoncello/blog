import { useAuthStore } from "@/domain/auth/stores/useAuthStore";
import { useGetMe } from "@/domain/users/hooks/useGetMe";
import { Outlet, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export function ProtectedRouteGuard() {
  const { isError } = useGetMe();
  const navigate = useNavigate({ from: "/" });
  const { clearAuthTokens } = useAuthStore.getState();

  if (isError) {
    clearAuthTokens();
    navigate({ to: "/signin" });
    toast.error("Faça login novamente");
  }

  return <Outlet />;
}
