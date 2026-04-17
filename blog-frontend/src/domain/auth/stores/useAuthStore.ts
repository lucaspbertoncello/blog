import { create } from "zustand";
import { persist } from "zustand/middleware";
import { decodeJwt } from "@/shared/lib/jwt";

export type States = {
  accessToken: string | null;
  refreshToken: string | null;
};
export type Actions = {
  isAuthenticated(): boolean;
  setAuthTokens(tokens: { accessToken: string; refreshToken: string }): void;
  clearAuthTokens(): void;
};
export type AuthStore = States & Actions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: () => {
        const token = get().accessToken;
        if (!token) return false;

        try {
          const { exp } = decodeJwt(token);
          return Date.now() < exp * 1000;
        } catch {
          return false;
        }
      },
      clearAuthTokens: () => set({ accessToken: null, refreshToken: null }),
      setAuthTokens: ({ accessToken, refreshToken }) => set({ accessToken, refreshToken }),
    }),
    { name: "auth" }
  )
);
