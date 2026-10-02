import { z } from "zod";
import { SchemaProductDetailSearch } from "./product-detail.schema";

export type ProductDetailSearch = z.infer<typeof SchemaProductDetailSearch>;
