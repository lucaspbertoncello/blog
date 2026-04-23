import { useLocation } from "@tanstack/react-router";
import { AdminArticlesView } from "./articles/AdminArticlesView";
import { AdminUsersView } from "./users/AdminUsersView";
import { useAdminPanelModel, type AdminPanelSection } from "./AdminPanelModel";

function getAdminPanelSection(pathname: string): AdminPanelSection {
  return pathname.endsWith("/admin/users") || pathname.endsWith("/admin/users/")
    ? "users"
    : "articles";
}

export function AdminPanelViewModel() {
  const { pathname } = useLocation();
  const model = useAdminPanelModel({ section: getAdminPanelSection(pathname) });

  if (model.section === "users") {
    return <AdminUsersView {...model.users} />;
  }

  return <AdminArticlesView {...model.articles} />;
}
