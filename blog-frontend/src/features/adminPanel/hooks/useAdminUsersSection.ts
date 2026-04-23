import { useListAllAccounts } from "@/domain/users/hooks/useListAllAccounts";
import { useAdminUserFilters } from "./useAdminUserFilters";
import { useAdminUserRoleActions } from "./useAdminUserRoleActions";

export type { User, UserRoles } from "./useAdminUserFilters";

type UseAdminUsersSectionProps = {
  enabled: boolean;
};

export function useAdminUsersSection({ enabled }: UseAdminUsersSectionProps) {
  const { data, isLoading, isError, refetch } = useListAllAccounts({ enabled });
  const userFilters = useAdminUserFilters({ users: data?.accounts ?? [] });
  const roleActions = useAdminUserRoleActions();

  return {
    users: userFilters.filteredUsers,
    totalCount: data?.count ?? 0,
    isLoading,
    isError,
    refetch,
    search: userFilters.search,
    setSearch: userFilters.setSearch,
    roleChangeTarget: roleActions.roleChangeTarget,
    setRoleChangeTarget: roleActions.setRoleChangeTarget,
    onChangeRole: roleActions.onChangeRole,
    isChangingRole: roleActions.isChangingRole,
  };
}
