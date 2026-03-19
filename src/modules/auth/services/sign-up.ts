import { AxiosError } from "axios";
import { api } from "@/shared/services/api";

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
    const error = er as AxiosError<{ message: string }>;
    const message = (error.response?.data?.message as string) || error.message;
    throw new Error(`${message}`);
  }
};
