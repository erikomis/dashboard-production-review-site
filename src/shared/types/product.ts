import type { Page } from "./page";
import type { SubCategory } from "./category";

export interface ProductImage {
  id: number;
  productId: number;
  urlImage: string;
  type?: string;
  filename?: string;
}

/** Item retornado por GET /production/list */
export interface Product {
  id: number;
  name: string;
  description: string;
  slug: string;
  subCategorieId: number;
  subCategorie?: SubCategory;
  productImages?: ProductImage[];
  createdAt?: string;
  updatedAt?: string;
}

/** Retornado por GET /production/{id} e GET /production/slug/{slug} */
export interface ProductDetail {
  id: number;
  name: string;
  description: string;
  slug: string;
  imageUrl: string | null;
  subCategorieId: number;
}

export type ProductPage = Page<Product>;

export type ProductSort = "recent" | "name-asc" | "name-desc";

export interface ProductListParams {
  page?: number;
  size?: number;
  search?: string;
  sort?: ProductSort;
  subCategorieId?: number;
}
