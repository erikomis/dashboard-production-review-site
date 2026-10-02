import { useMutation, useQuery } from "@tanstack/react-query";
import { UsersService } from "@/modules/site/services/users.service";
import { queryClient } from "@/shared/libs/react-query";
import type { UserPreferences } from "@/shared/types/user";

export const preferencesKey = ["preferences"] as const;

export const useQueryPreferences = (enabled = true) =>
  useQuery({ queryKey: preferencesKey, queryFn: UsersService.getPreferences, enabled, staleTime: 0 });

/** Salva na hora (otimista), desfazendo se a API falhar. */
export const useMutationPreferences = () =>
  useMutation({
    mutationFn: (prefs: UserPreferences) => UsersService.updatePreferences(prefs),
    onMutate: async (prefs) => {
      await queryClient.cancelQueries({ queryKey: preferencesKey });
      const previous = queryClient.getQueryData<UserPreferences>(preferencesKey);
      queryClient.setQueryData(preferencesKey, prefs);
      return { previous };
    },
    onError: (_error, _prefs, context) => {
      if (context?.previous) queryClient.setQueryData(preferencesKey, context.previous);
    },
    onSuccess: (saved) => queryClient.setQueryData(preferencesKey, saved),
  });
