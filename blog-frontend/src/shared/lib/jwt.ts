type JwtPayload = {
  exp: number;
  [key: string]: unknown;
};

export function decodeJwt(token: string): JwtPayload {
  const payload = token.split(".")[1];
  // base64url → base64 → JSON
  const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
  return JSON.parse(json) as JwtPayload;
}

export function isTokenExpired(token: string): boolean {
  try {
    const { exp } = decodeJwt(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}
