import { useMutation } from "@tanstack/react-query";
import { SignUpService } from "../services/sign-up";

export const useMutationSignUp = () =>
  useMutation({
    mutationFn: (data: {
      name: string;
      username: string;
      email: string;
      password: string;
    }) => SignUpService(data),
  });
