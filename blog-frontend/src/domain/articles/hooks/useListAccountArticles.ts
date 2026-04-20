import { useQuery } from "@tanstack/react-query";
import { listAccountArticles } from "../services/listAccountArticles";

export function useListAccountArticles({ accountId }: { accountId: string }) {
  const methods = useQuery({
    queryKey: ["account-articles", accountId],
    queryFn: () => listAccountArticles({ accountId }),
  });

  return methods;
}
