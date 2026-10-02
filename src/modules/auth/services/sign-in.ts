import { api } from "@/shared/services/api";
import { toHttpError } from "@/shared/services/http-error";

type SignInProps = {
  /** username ou e-mail (a API aceita os dois no campo `username`) */
  username: string;
  password: string;
};

export const SignInService = async ({ username, password }: SignInProps) => {
  try {
    const response = await api.request({
      url: "/auth/sign-in",
      method: "POST",
      data: { username: username.trim(), password },
    });
    return response;
  } catch (er) {
    throw toHttpError(er);
  }
};
