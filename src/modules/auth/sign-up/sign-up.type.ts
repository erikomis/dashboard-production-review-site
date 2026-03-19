import { z } from "zod";
import { SchemaSignUp } from "./sign-up.schema";

export type SignUpValues = z.infer<typeof SchemaSignUp>;
