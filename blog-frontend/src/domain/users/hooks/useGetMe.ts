import { useQuery } from "@tanstack/react-query";
import { getMe } from "../services/getMe";
import { useAuthStore } from "@/domain/auth/stores/useAuthStore";

export function useGetMe() {
  const getIsAuthenticated = useAuthStore((state) => state.getIsAuthenticated);
  const methods = useQuery({
    queryFn: getMe,
    queryKey: ["getMe"],
    retry: false,
    enabled: getIsAuthenticated(),
  });

  return methods;
}
