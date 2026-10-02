import { queryOptions, useQuery } from "@tanstack/react-query";
import { UsersService } from "@/modules/site/services/users.service";

export const profileQueryOptions = (username: string) =>
  queryOptions({
    queryKey: ["profile", username],
    queryFn: () => UsersService.getProfile(username),
    staleTime: 60_000,
  });

export const useQueryProfile = (username: string) =>
  useQuery({ ...profileQueryOptions(username), enabled: !!username });
