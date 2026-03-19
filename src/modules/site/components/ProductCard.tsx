import { Link } from "@tanstack/react-router";
import type { Product } from "@/shared/types/product";

interface Props {
  product: Product;
}

export const ProductCard = ({ product }: Props) => {
  return (
    <Link
      to={`/products/${product.slug}`}
      className="group bg-white rounded-xl border border-stroke p-6 hover:shadow-md hover:border-primary transition-all duration-200 flex flex-col"
    >
      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
        <span className="text-2xl">📦</span>
      </div>
      <h3 className="font-semibold text-black dark:text-white group-hover:text-primary transition-colors line-clamp-2 mb-2">
        {product.name}
      </h3>
      <p className="text-sm text-gray-500 line-clamp-3 flex-1">{product.description}</p>
      <div className="mt-4 flex items-center text-sm text-primary font-medium">
        Ver avaliações →
      </div>
    </Link>
  );
};
