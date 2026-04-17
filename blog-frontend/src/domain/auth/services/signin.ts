import { httpClient } from "@/shared/lib/httpClient";

export async function signin(params: SigninService.Params) {
  const { data } = await httpClient.post<SigninService.Response>("/auth/signin", params);
  return data;
}

export namespace SigninService {
  export type Params = { email: string; password: string };
  export type Response = { accessToken: string; refreshToken: string };
}
