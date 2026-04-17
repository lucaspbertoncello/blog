import { httpClient } from "@/shared/lib/httpClient";
import type { User } from "../types/User";

export async function getMe() {
  const { data } = await httpClient.get<GetMeService.Response>("/me");
  return data;
}

export namespace GetMeService {
  export type Response = User;
}
