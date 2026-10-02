import { z } from "zod";
import type { ReviewSort } from "@/shared/types/review";
import { SchemaProductDetailSearch } from "./product-detail.schema";

export type ProductDetailSearch = z.infer<typeof SchemaProductDetailSearch>;

export interface ReviewSortOption {
  value: ReviewSort;
  label: string;
}
