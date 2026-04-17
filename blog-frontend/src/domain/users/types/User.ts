export type User = {
  accountId: string;
  email: string;
  active: true;
  role: UserRoles;
  createdAt: string;
  updatedAt: string;
};

export type UserRoles = "admin" | "writer" | "student";
