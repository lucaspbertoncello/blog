import { useMemo, useState } from "react";
import type { User, UserRoles } from "@/domain/users/types/User";

export type { User, UserRoles };

type UseAdminUserFiltersProps = {
  users: User[];
};

export function useAdminUserFilters({ users }: UseAdminUserFiltersProps) {
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => u.email.toLowerCase().includes(q));
  }, [users, search]);

  return {
    filteredUsers,
    search,
    setSearch,
  };
}
