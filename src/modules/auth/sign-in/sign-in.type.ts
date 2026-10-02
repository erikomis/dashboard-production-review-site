import { z } from "zod";
import { SchemaSignIn, SchemaSignInSearch } from "./sign-in.schema";

export type SignInValues = z.infer<typeof SchemaSignIn>;
export type SignInSearch = z.infer<typeof SchemaSignInSearch>;
