import { z } from "zod";

/** Corpo de PATCH /user/me/preferences */
export const SchemaPreferences = z.object({
  emailNotifications: z.boolean(),
});

export const THEME_OPTIONS = [
  { value: "system", label: "Automático", description: "Segue o tema do seu sistema" },
  { value: "light", label: "Claro", description: "Fundo claro em todas as telas" },
  { value: "dark", label: "Escuro", description: "Mais confortável à noite" },
] as const;
