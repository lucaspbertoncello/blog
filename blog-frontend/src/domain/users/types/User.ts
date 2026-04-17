export type User = {
  accountId: string;
  email: string;
  active: true;
  role: "admin" | "writer" | "student";
  createdAt: string;
  updatedAt: string;
};
