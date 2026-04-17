import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type States = {
  isAuthenticated: boolean;
};
export type Actions = {
  setAuthTokens(tokens: { accessToken: string; refreshToken: string }): void;
  clearAuthTokens(): void;
  getIsAuthenticated(): boolean;
};
export type AuthStore = States & Actions;

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set, get) => ({
      isAuthenticated: !!localStorage.getItem("blog::accessToken"),
      getIsAuthenticated: () => {
        return get().isAuthenticated;
      },
      clearAuthTokens: () => {
        set({ isAuthenticated: false });
        localStorage.removeItem("blog::accessToken");
        localStorage.removeItem("blog::refreshToken");
      },
      setAuthTokens: ({ accessToken, refreshToken }) => {
        set({ isAuthenticated: true });
        localStorage.setItem("blog::accessToken", accessToken);
        localStorage.setItem("blog::refreshToken", refreshToken);
      },
    }),
    { name: "auth" }
  )
);
