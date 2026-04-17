import { httpClient } from "@/shared/lib/httpClient";

export async function signup(params: SignupService.Params) {
  const { data } = await httpClient.post<SignupService.Response>("/auth/signup", params);
  return data;
}

export namespace SignupService {
  export type Params = { email: string; password: string };
  export type Response = { codeDeliveryMessage: string };
}
