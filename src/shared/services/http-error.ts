import { AxiosError } from "axios";
import type { ApiError } from "@/shared/types/page";

/** Erro normalizado das chamadas HTTP: mensagem legível + status HTTP. */
export class HttpError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

export const toHttpError = (er: unknown): HttpError => {
  if (er instanceof HttpError) return er;
  const error = er as AxiosError<ApiError>;
  const status = error.response?.status;
  if (!error.response) {
    return new HttpError(
      "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
    );
  }
  const message = error.response.data?.message || error.message;
  return new HttpError(message, status);
};
