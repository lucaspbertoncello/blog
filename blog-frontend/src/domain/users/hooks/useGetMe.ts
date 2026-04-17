import { useQuery } from "@tanstack/react-query";
import { getMe } from "../services/getMe";

export function useGetMe() {
  const methods = useQuery({
    queryFn: getMe,
    queryKey: ["getMe"],
    retry: false,
  });

  return methods;
}
