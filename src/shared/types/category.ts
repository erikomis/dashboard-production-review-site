export interface SubCategory {
  id: number;
  name: string;
  description?: string;
  slug: string;
  categorieId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  slug: string;
  subCategories: SubCategory[];
  createdAt?: string;
  updatedAt?: string;
}

/** Retornado por GET /category/slug/{slug} */
export interface CategoryDetail {
  id: number;
  name: string;
  description?: string;
  slug: string;
  subCategories: Pick<SubCategory, "id" | "name" | "description" | "slug">[];
}
