import { z } from "zod";
import { SchemaSignIn } from "./sign-in.schema";

export type SignInValues = z.infer<typeof SchemaSignIn>;
