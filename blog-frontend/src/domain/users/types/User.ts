export type User = {
  accountId: string;
  email: string;
  active: boolean;
  role: UserRoles;
  createdAt: string;
  updatedAt: string;
};

export type UserRoles = "admin" | "writer" | "student";
