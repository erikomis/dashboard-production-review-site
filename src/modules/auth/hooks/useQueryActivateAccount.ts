import { useQuery } from "@tanstack/react-query";
import { ActivateAccountService } from "../services/activate-account";

export const useQueryActivateAccount = (token: string) =>
  useQuery({
    queryKey: ["activate-account", token],
    queryFn: async () => {
      await ActivateAccountService(token);
      return true;
    },
    enabled: !!token,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });
