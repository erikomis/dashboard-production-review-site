import { useMutation } from "@tanstack/react-query";
import { SignInService } from "../services/sign-in";

export const useMutationSignIn = () =>
  useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      SignInService({ email, password }),
  });
