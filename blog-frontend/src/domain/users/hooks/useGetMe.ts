import { useQuery } from "@tanstack/react-query";
import { getMe } from "../services/getMe";
import { useAuthStore } from "@/domain/auth/stores/useAuthStore";

export function useGetMe() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const methods = useQuery({
    queryFn: getMe,
    queryKey: ["getMe", isAuthenticated],
    retry: false,
  });

  return methods;
}
