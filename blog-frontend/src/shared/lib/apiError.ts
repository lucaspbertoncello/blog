import { isAxiosError } from "axios";

type ApiErrorBody = { message: string };

const DEFAULT_MESSAGE = "Algo deu errado. Tente novamente";

export function getApiErrorMessage(error: unknown): string {
  if (isAxiosError<ApiErrorBody>(error)) {
    return error.response?.data?.message ?? DEFAULT_MESSAGE;
  }
  return DEFAULT_MESSAGE;
}
