import { z } from "zod";
import { SchemaProfileSearch } from "./profile.schema";

export type ProfileSearch = z.infer<typeof SchemaProfileSearch>;
