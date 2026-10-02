import { z } from "zod";
import { SchemaCategorySearch } from "./category.schema";

export type CategorySearch = z.infer<typeof SchemaCategorySearch>;
