import { httpClient } from "@/shared/lib/httpClient";

export async function verifyCode(params: VerifyCodeService.Params) {
  const { data } = await httpClient.post<VerifyCodeService.Response>("/auth/confirm-code", params);
  return data;
}

export namespace VerifyCodeService {
  export type Params = { email: string; code: string };
  export type Response = { message: string };
}
