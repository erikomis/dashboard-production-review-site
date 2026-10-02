import type { Page } from "./page";

/** Item retornado por GET /production/list (nota e total consideram só avaliações visíveis). */
export interface ProductSummary {
  id: number;
  name: string;
  description: string;
  slug: string;
  subCategorieId: number;
  subCategorieName: string | null;
  subCategorieSlug: string | null;
  categoryId: number | null;
  categoryName: string | null;
  categorySlug: string | null;
  /** Foto principal (ex.: images.openfoodfacts.org) ou null */
  imageUrl: string | null;
  /** Média com 1 casa decimal; null quando ainda não há avaliações */
  averageNote: number | null;
  totalReviews: number;
  createdAt?: string;
}

export interface ProductDetailImage {
  id: number;
  urlImage: string;
}

/** Retornado por GET /production/{id} e GET /production/slug/{slug} */
export interface ProductDetail extends ProductSummary {
  images: ProductDetailImage[];
}

export type ProductPage = Page<ProductSummary>;

/** Ordenações oferecidas no site (mapeadas para property/sort da API). */
export type ProductSort = "recent" | "name-asc" | "name-desc" | "rating" | "popular";

export interface ProductListParams {
  page?: number;
  size?: number;
  search?: string;
  sort?: ProductSort;
  categoryId?: number;
  subCategorieId?: number;
  /** Só produtos com pelo menos uma avaliação visível */
  onlyRated?: boolean;
}
