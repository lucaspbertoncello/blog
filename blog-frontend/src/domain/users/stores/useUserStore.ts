import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { User, UserRoles } from "../types/User";

export type State = {
  account: Omit<User, "role"> | null;
  role: UserRoles | null;
};

export type Actions = {
  hasAdminAccess(): boolean;
  hasWriterAccess(): boolean;
  setAccountData(params: { account: Omit<User, "role">; role: UserRoles }): void;
};

export type UserStore = State & Actions;

export const useUserStore = create<UserStore>()(
  devtools((set, get) => ({
  account: null,
  role: null,
  hasAdminAccess: () => {
    return get().role === "admin";
  },
  hasWriterAccess: () => {
    return get().role === "writer" || get().role === "admin";
  },
  setAccountData: ({ account, role }) => set({ account, role }),
  }), { name: "UserStore" }
));
