import { useAdminArticlesModel } from "./AdminArticlesModel";
import { AdminArticlesView } from "./AdminArticlesView";

export function AdminArticlesViewModel() {
  const model = useAdminArticlesModel();
  return <AdminArticlesView {...model} />;
}
