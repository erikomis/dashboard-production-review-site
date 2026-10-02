import { useQuery } from "@tanstack/react-query";
import { me } from "../services/me";

export const useMeQuery = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: () => me(),
    // 401 = visitante não logado: não faz sentido tentar de novo
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
