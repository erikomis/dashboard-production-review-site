import { SchemaCreateReview } from "@/modules/site/view/product-detail/create-review/create-review.schema";

export { DESCRIPTION_MAX, TITLE_MAX } from "@/modules/site/view/product-detail/create-review/create-review.schema";

/** Mesmas regras da criação: nota 1–5, título e comentário. */
export const SchemaEditReview = SchemaCreateReview;
