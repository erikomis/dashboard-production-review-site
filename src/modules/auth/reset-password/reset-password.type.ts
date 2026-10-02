import { z } from "zod";
import { SchemaResetPassword, SchemaResetPasswordSearch } from "./reset-password.schema";

export type ResetPasswordValues = z.infer<typeof SchemaResetPassword>;
export type ResetPasswordSearch = z.infer<typeof SchemaResetPasswordSearch>;
