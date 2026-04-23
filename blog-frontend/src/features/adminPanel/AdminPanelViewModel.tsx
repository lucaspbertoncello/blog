import { AdminArticlesView } from "./articles/AdminArticlesView";
import { AdminUsersView } from "./users/AdminUsersView";
import { useAdminPanelModel, type AdminPanelSection } from "./AdminPanelModel";

type AdminPanelViewModelProps = {
  section: AdminPanelSection;
};

export function AdminPanelViewModel({ section }: AdminPanelViewModelProps) {
  const model = useAdminPanelModel({ section });

  if (model.section === "users") {
    return <AdminUsersView {...model.users} />;
  }

  return <AdminArticlesView {...model.articles} />;
}
