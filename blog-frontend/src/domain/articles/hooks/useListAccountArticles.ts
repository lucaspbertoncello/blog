import { useQuery } from "@tanstack/react-query";
import { listAccountArticles } from "../services/listAccountArticles";

export function useListAccountArticles({
  accountId,
  enabled = true,
}: {
  accountId: string;
  enabled?: boolean;
}) {
  const methods = useQuery({
    queryKey: ["account-articles", accountId],
    queryFn: () => listAccountArticles({ accountId }),
    enabled: enabled && !!accountId,
  });

  return methods;
}
