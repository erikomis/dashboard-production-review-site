import { api } from "@/shared/services/api";
import { toHttpError } from "@/shared/services/http-error";

/** GET /auth/activate/{token} — link enviado por e-mail após o cadastro. */
export const ActivateAccountService = async (token: string) => {
  try {
    const response = await api.request({
      url: `/auth/activate/${encodeURIComponent(token)}`,
      method: "GET",
    });
    return response;
  } catch (er) {
    throw toHttpError(er);
  }
};
