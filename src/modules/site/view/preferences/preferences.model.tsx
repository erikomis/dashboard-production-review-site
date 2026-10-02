import { useState } from "react";
import { toast } from "react-toastify";
import { useMutationPreferences, useQueryPreferences } from "@/modules/site/hooks/usePreferences";
import { useMeQuery } from "@/shared/hooks/useMeQuery";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { useTheme } from "@/shared/hooks/useTheme";
import { HttpError } from "@/shared/services/http-error";
import type { ThemePreference } from "@/shared/theme/theme";
import { SchemaPreferences, THEME_OPTIONS } from "./preferences.schema";

export const usePreferencesModel = () => {
  useDocumentTitle("Preferências", { noindex: true });
  const { data: user } = useMeQuery();
  const prefsQuery = useQueryPreferences(!!user);
  const mutation = useMutationPreferences();
  const theme = useTheme();
  const [announcement, setAnnouncement] = useState("");

  const emailNotifications = prefsQuery.data?.emailNotifications ?? true;

  const onToggleEmail = () => {
    if (mutation.isPending || !prefsQuery.data) return;
    const next = SchemaPreferences.parse({ emailNotifications: !emailNotifications });
    mutation.mutate(next, {
      onSuccess: (saved) => {
        const text = saved.emailNotifications
          ? "E-mails de notificação ativados."
          : "E-mails de notificação desativados. Você continua vendo tudo no sino do site.";
        setAnnouncement(text);
        toast.success(text);
      },
      onError: (error) =>
        toast.error(
          error instanceof HttpError && error.status && error.status < 500
            ? error.message
            : "Não foi possível salvar sua preferência. Tente novamente.",
        ),
    });
  };

  const onThemeChange = (value: ThemePreference) => {
    theme.setPreference(value);
    const option = THEME_OPTIONS.find((o) => o.value === value);
    setAnnouncement(`Tema ${option?.label.toLowerCase()} aplicado.`);
  };

  return {
    user,
    emailNotifications,
    isLoadingPrefs: prefsQuery.isPending,
    isErrorPrefs: prefsQuery.isError,
    refetchPrefs: prefsQuery.refetch,
    onToggleEmail,
    isSaving: mutation.isPending,
    themePreference: theme.preference,
    resolvedTheme: theme.resolved,
    themeOptions: THEME_OPTIONS,
    onThemeChange,
    announcement,
  };
};
