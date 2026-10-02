import { z } from "zod";
import { SchemaPreferences } from "./preferences.schema";

export type PreferencesValues = z.infer<typeof SchemaPreferences>;
