import { z } from "zod";
import { SchemaProductListSearch } from "./product-list.schema";

export type ProductListSearch = z.infer<typeof SchemaProductListSearch>;
