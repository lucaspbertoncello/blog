import { MOCK_ARTICLES } from "./mock-data";
import { useAuthStore } from "@/domain/auth/stores/useAuthStore";
import { useUserStore } from "@/domain/users/stores/useUserStore";
import { useShallow } from "zustand/react/shallow";

export function useFeedModel() {
  const authStore = useAuthStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
      clearAuthTokens: state.clearAuthTokens,
    }))
  );
  const userStore = useUserStore(
    useShallow((state) => ({
      account: state.account,
      hasAdminAccess: state.hasAdminAccess,
      hasWriterAccess: state.hasWriterAccess,
    }))
  );

  return {
    articles: MOCK_ARTICLES,
    userStore,
    authStore,
  };
}
