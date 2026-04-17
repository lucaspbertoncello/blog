import { useQuery } from "@tanstack/react-query";
import { getMe } from "../services/getMe";
import { useAuthStore } from "@/domain/auth/stores/useAuthStore";

export function useGetMe() {
  const methods = useQuery({
    queryFn: getMe,
    queryKey: ["getMe"],
    enabled: useAuthStore.getState().getIsAuthenticated(),
    retry: false,
  });

  return methods;
}
