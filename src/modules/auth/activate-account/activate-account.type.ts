import { z } from "zod";
import { SchemaActivateAccountParams } from "./activate-account.schema";

export type ActivateAccountParams = z.infer<typeof SchemaActivateAccountParams>;
