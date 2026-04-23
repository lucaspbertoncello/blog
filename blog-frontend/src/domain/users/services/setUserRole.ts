import { httpClient } from "@/shared/lib/httpClient";
import type { UserRoles } from "../types/User";

export async function setUserRole(params: SetUserRoleService.Params) {
  await httpClient.patch(`/users/${params.accountId}/role`, { role: params.role });
}

export namespace SetUserRoleService {
  export type Params = { accountId: string; role: UserRoles };
}
