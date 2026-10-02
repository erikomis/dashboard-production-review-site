import { AxiosError } from "axios";
import type { ApiError } from "@/shared/types/page";

/** Erro normalizado das chamadas HTTP: mensagem legível + status HTTP. */
export class HttpError extends Error {
  status?: number;
  /** Segundos de espera informados pela API num 429 (Retry-After) */
  retryAfter?: number;

  constructor(message: string, status?: number, retryAfter?: number) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

/**
 * Segundos de espera de um 429. O header Retry-After só é legível no navegador se a API o
 * expuser via CORS (Access-Control-Expose-Headers); sem isso, lê o número da mensagem
 * ("Muitas tentativas. Tente novamente em N segundos.").
 */
export const parseRetryAfter = (header: unknown, message?: string): number | undefined => {
  const fromHeader = Number.parseInt(String(header ?? ""), 10);
  if (Number.isFinite(fromHeader) && fromHeader > 0) return fromHeader;
  const match = message?.match(/(\d+)\s*segundo/i);
  return match ? Number.parseInt(match[1], 10) : undefined;
};

/** 45 -> "45 segundos"; 90 -> "1 min e 30 s"; 3600 -> "60 min" */
export const formatWait = (seconds: number) => {
  if (seconds < 60) return `${seconds} ${seconds === 1 ? "segundo" : "segundos"}`;
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return rest ? `${minutes} min e ${rest} s` : `${minutes} min`;
};

export const isRateLimited = (error: unknown): boolean =>
  error instanceof HttpError && error.status === 429;

export const toHttpError = (er: unknown): HttpError => {
  if (er instanceof HttpError) return er;
  const error = er as AxiosError<ApiError>;
  const status = error.response?.status;
  if (!error.response) {
    return new HttpError(
      "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
    );
  }
  const apiMessage = error.response.data?.message;
  if (status === 429) {
    const retryAfter = parseRetryAfter(error.response.headers?.["retry-after"], apiMessage);
    const base = apiMessage || "Muitas tentativas.";
    // Garante que o tempo de espera aparece mesmo se a mensagem da API não trouxer o número
    const message =
      retryAfter && !/\d/.test(base) ? `${base} Tente novamente em ${formatWait(retryAfter)}.` : base;
    return new HttpError(message, status, retryAfter);
  }
  return new HttpError(apiMessage || error.message, status);
};
