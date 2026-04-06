export function bodyParser(body: string | undefined) {
  if (!body) return;
  return JSON.parse(body ?? "");
}
