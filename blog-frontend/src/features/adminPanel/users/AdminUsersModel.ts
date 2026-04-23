import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useListAllAccounts } from "@/domain/users/hooks/useListAllAccounts";
import { useSetUserRole } from "@/domain/users/hooks/useSetUserRole";
import type { User, UserRoles } from "@/domain/users/types/User";

export type { User, UserRoles };

export function useAdminUsersModel() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [roleChangeTarget, setRoleChangeTarget] = useState<{ accountId: string; currentRole: UserRoles } | null>(null);

  const { data, isLoading, isError, refetch } = useListAllAccounts();
  const setUserRole = useSetUserRole();

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase();
    return (data?.accounts ?? []).filter((u) => u.email.toLowerCase().includes(q));
  }, [data, search]);

  const onChangeRole = async (accountId: string, role: UserRoles) => {
    await setUserRole.mutateAsync({ accountId, role });
    setRoleChangeTarget(null);
    queryClient.invalidateQueries({ queryKey: ["admin-accounts"] });
  };

  return {
    users: filteredUsers,
    totalCount: data?.count ?? 0,
    isLoading,
    isError,
    refetch,
    search,
    setSearch,
    roleChangeTarget,
    setRoleChangeTarget,
    onChangeRole,
    isChangingRole: setUserRole.isPending,
  };
}
