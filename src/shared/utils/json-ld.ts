import type { SeoProduct } from "@/shared/types/seo";

/** JSON-LD schema.org Product + AggregateRating + Review a partir de GET /seo/products/{slug}. */
export const buildProductJsonLd = (seo: SeoProduct): Record<string, unknown> => {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: seo.name,
    url: seo.url,
  };
  if (seo.description) data.description = seo.description;
  if (seo.image) data.image = seo.image;
  if (seo.brand) data.brand = { "@type": "Brand", name: seo.brand };
  if (seo.aggregateRating && seo.aggregateRating.reviewCount > 0) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: seo.aggregateRating.ratingValue,
      reviewCount: seo.aggregateRating.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }
  if (seo.reviews?.length) {
    data.review = seo.reviews.map((review) => ({
      "@type": "Review",
      name: review.name,
      reviewBody: review.reviewBody,
      datePublished: review.datePublished,
      author: { "@type": "Person", name: review.author },
      reviewRating: { "@type": "Rating", ratingValue: review.ratingValue, bestRating: 5, worstRating: 1 },
    }));
  }
  return data;
};
