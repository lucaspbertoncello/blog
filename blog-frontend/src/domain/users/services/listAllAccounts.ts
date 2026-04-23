import { httpClient } from "@/shared/lib/httpClient";
import type { User } from "../types/User";

export async function listAllAccounts() {
  const { data } = await httpClient.get<ListAllAccountsService.Response>("/accounts");
  return data;
}

export namespace ListAllAccountsService {
  export type Response = { count: number; accounts: User[] };
}
