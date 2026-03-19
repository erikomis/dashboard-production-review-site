import { AxiosError } from "axios";
import { api } from "@/shared/services/api";

type SignInProps = {
  email: string;
  password: string;
};

export const SignInService = async ({ email, password }: SignInProps) => {
  try {
    const response = await api.request({
      url: "/auth/sign-in",
      method: "POST",
      data: { email, password },
    });
    return response;
  } catch (er) {
    const error = er as AxiosError<{ message: string }>;
    const message = (error.response?.data?.message as string) || error.message;
    throw new Error(`${message}`);
  }
};
