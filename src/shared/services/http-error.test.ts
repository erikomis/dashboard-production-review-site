import { describe, expect, it } from "vitest";
import { AxiosError, AxiosHeaders } from "axios";
import { formatWait, parseRetryAfter, toHttpError } from "./http-error";

const axios429 = (message: string | undefined, retryAfter?: string) =>
  new AxiosError("Request failed", "ERR_BAD_REQUEST", undefined, undefined, {
    status: 429,
    statusText: "Too Many Requests",
    data: message ? { message, httpStatus: "TOO_MANY_REQUESTS", statusCode: 429 } : undefined,
    headers: retryAfter ? { "retry-after": retryAfter } : {},
    config: { headers: new AxiosHeaders() },
  });

describe("429 (rate limit)", () => {
  it("lê o Retry-After do header e mantém a mensagem da API", () => {
    const error = toHttpError(axios429("Muitas tentativas. Tente novamente em 37 segundos.", "37"));
    expect(error.status).toBe(429);
    expect(error.retryAfter).toBe(37);
    expect(error.message).toBe("Muitas tentativas. Tente novamente em 37 segundos.");
  });

  it("sem header legível (CORS), usa o número da mensagem", () => {
    expect(parseRetryAfter(undefined, "Tente novamente em 12 segundos.")).toBe(12);
  });

  it("acrescenta o tempo quando a mensagem não traz", () => {
    const error = toHttpError(axios429("Muitas tentativas.", "90"));
    expect(error.message).toBe("Muitas tentativas. Tente novamente em 1 min e 30 s.");
    expect(formatWait(1)).toBe("1 segundo");
  });
});
