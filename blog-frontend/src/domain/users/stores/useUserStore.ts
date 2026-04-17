import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { User } from "../types/User";

export type State = {
  account: User | null;
};

export type Actions = {
  hasAdminAccess(): boolean;
  hasWriterAccess(): boolean;
  setAccountData(params: { account: User | null }): void;
  getAccountData(): { account: User | null };
};

export type UserStore = State & Actions;

export const useUserStore = create<UserStore>()(
  devtools(
    (set, get) => ({
      account: null,
      hasAdminAccess: () => {
        return get().account?.role === "admin";
      },
      hasWriterAccess: () => {
        return get().account?.role === "writer" || get().account?.role === "admin";
      },
      setAccountData: ({ account }) => set({ account }),
      getAccountData: () => get().account,
    }),
    { name: "UserStore" }
  )
);
