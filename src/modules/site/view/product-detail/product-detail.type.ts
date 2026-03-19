import { z } from "zod";
import { SchemaReview } from "./product-detail.schema";

export type ReviewFormValues = z.infer<typeof SchemaReview>;
