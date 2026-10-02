import { api } from "@/shared/services/api";
import { toHttpError } from "@/shared/services/http-error";

/** PATCH /auth/recovery-code/password — {email, password, recoveryCode}. */
export const ResetPasswordService = async (
  email: string,
  password: string,
  recoveryCode: string,
) => {
  try {
    const response = await api.request({
      url: "/auth/recovery-code/password",
      method: "PATCH",
      data: { email, password, recoveryCode },
    });
    return response;
  } catch (er) {
    throw toHttpError(er);
  }
};
