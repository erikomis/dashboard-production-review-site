/** GET /seo/products/{slug} — dados prontos para o JSON-LD do produto */
export interface SeoProduct {
  name: string;
  description: string | null;
  image: string | null;
  brand?: string | null;
  url: string;
  aggregateRating: { ratingValue: number; reviewCount: number } | null;
  reviews: {
    author: string;
    datePublished: string;
    reviewBody: string;
    name: string;
    ratingValue: number;
  }[];
}
