import { useAdminArticlesSection } from "./hooks/useAdminArticlesSection";
import { useAdminUsersSection } from "./hooks/useAdminUsersSection";

export type AdminPanelSection = "articles" | "users";

type UseAdminPanelModelProps = {
  section: AdminPanelSection;
};

export function useAdminPanelModel({ section }: UseAdminPanelModelProps) {
  const articles = useAdminArticlesSection({ enabled: section === "articles" });
  const users = useAdminUsersSection({ enabled: section === "users" });

  return {
    section,
    articles,
    users,
  };
}
