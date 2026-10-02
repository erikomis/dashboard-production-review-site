import { useParams } from "@tanstack/react-router";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { useQueryActivateAccount } from "../hooks/useQueryActivateAccount";
import { SchemaActivateAccountParams } from "./activate-account.schema";

export const useActivateAccountModel = () => {
  useDocumentTitle("Ativar conta");
  const params = useParams({ from: "/auth/activate-account/$token" });
  const parsed = SchemaActivateAccountParams.safeParse(params);
  const token = parsed.success ? parsed.data.token : "";

  const { isPending, isSuccess, isError } = useQueryActivateAccount(token);

  return {
    isLoading: !!token && isPending,
    isSuccess,
    isError: isError || !token,
  };
};
