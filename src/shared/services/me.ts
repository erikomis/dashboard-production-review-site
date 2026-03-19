import { AxiosError } from "axios";
import { api } from "./api";
import type { User } from "@/shared/types/user";

export const me = async () => {
  try {
    const response = await api.request<User>({
      url: "/user/me",
      method: "GET",
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    const axiosError = error as AxiosError;
    throw new Error(String(axiosError.response?.data));
  }
};
