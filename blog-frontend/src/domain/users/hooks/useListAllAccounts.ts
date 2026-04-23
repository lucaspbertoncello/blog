import { useQuery } from "@tanstack/react-query";
import { listAllAccounts } from "../services/listAllAccounts";

type UseListAllAccountsProps = {
  enabled?: boolean;
};

export function useListAllAccounts({ enabled = true }: UseListAllAccountsProps = {}) {
  return useQuery({
    queryKey: ["admin-accounts"],
    queryFn: listAllAccounts,
    enabled,
  });
}
