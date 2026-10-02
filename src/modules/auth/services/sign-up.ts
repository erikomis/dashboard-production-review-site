import { api } from "@/shared/services/api";
import { toHttpError } from "@/shared/services/http-error";

type SignUpProps = {
  name: string;
  username: string;
  email: string;
  password: string;
};

export const SignUpService = async (data: SignUpProps) => {
  try {
    const response = await api.request({
      url: "/auth/sign-up",
      method: "POST",
      data,
    });
    return response;
  } catch (er) {
    throw toHttpError(er);
  }
};
