import { z } from "zod";
import { SchemaMyReviewsSearch } from "./my-reviews.schema";

export type MyReviewsSearch = z.infer<typeof SchemaMyReviewsSearch>;
