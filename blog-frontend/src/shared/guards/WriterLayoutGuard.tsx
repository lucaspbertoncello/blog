import { createRoleGuard } from "./createRoleGuard";

export const WriterLayoutGuard = createRoleGuard(
  (s) => s.hasWriterAccess() || s.hasAdminAccess()
);
