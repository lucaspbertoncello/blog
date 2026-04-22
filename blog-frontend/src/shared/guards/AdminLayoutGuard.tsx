import { createRoleGuard } from "./createRoleGuard";

export const AdminLayoutGuard = createRoleGuard((s) => s.hasAdminAccess());
