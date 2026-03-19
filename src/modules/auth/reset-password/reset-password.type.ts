import { z } from "zod";
import { SchemaResetPassword } from "./reset-password.schema";

export type ResetPasswordValues = z.infer<typeof SchemaResetPassword>;
