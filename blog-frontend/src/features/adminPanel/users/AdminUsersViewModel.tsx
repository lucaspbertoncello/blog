import { useAdminUsersModel } from "./AdminUsersModel";
import { AdminUsersView } from "./AdminUsersView";

export function AdminUsersViewModel() {
  const model = useAdminUsersModel();
  return <AdminUsersView {...model} />;
}
