export function getFieldError(error: unknown): string {
  if (typeof error === "string") return error;
  if (error && typeof (error as { message?: string }).message === "string") {
    return (error as { message: string }).message;
  }
  return String(error);
}
