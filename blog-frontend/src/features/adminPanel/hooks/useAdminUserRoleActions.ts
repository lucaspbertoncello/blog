import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSetUserRole } from "@/domain/users/hooks/useSetUserRole";
import type { UserRoles } from "@/domain/users/types/User";

export function useAdminUserRoleActions() {
  const queryClient = useQueryClient();
  const setUserRole = useSetUserRole();
  const [roleChangeTarget, setRoleChangeTarget] = useState<{
    accountId: string;
    currentRole: UserRoles;
  } | null>(null);

  const onChangeRole = async (accountId: string, role: UserRoles) => {
    await setUserRole.mutateAsync({ accountId, role });
    setRoleChangeTarget(null);
    queryClient.invalidateQueries({ queryKey: ["admin-accounts"] });
  };

  return {
    roleChangeTarget,
    setRoleChangeTarget,
    onChangeRole,
    isChangingRole: setUserRole.isPending,
  };
}
