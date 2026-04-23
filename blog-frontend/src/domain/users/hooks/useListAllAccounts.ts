import { useQuery } from "@tanstack/react-query";
import { listAllAccounts } from "../services/listAllAccounts";

export function useListAllAccounts() {
  return useQuery({
    queryKey: ["admin-accounts"],
    queryFn: listAllAccounts,
  });
}
