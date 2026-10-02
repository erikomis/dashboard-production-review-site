import { api } from "@/shared/services/api";
import { toHttpError } from "@/shared/services/http-error";

/** POST /auth/send-recovery-code/send — envia código de 6 dígitos por e-mail. */
export const ForgotPasswordService = async (email: string) => {
  try {
    const response = await api.request({
      url: "/auth/send-recovery-code/send",
      method: "POST",
      data: { email },
    });
    return response;
  } catch (er) {
    throw toHttpError(er);
  }
};
