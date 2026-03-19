import { Link } from "@tanstack/react-router";
import { ProductCard } from "@/modules/site/components/ProductCard";
import { useHomeModel } from "./home.model";

type HomeViewProps = ReturnType<typeof useHomeModel>;

export const HomeView = ({ data, isLoading }: HomeViewProps) => {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            Avalie os produtos que você ama
          </h1>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Compartilhe sua experiência e ajude outras pessoas a fazerem a melhor escolha.
          </p>
          <Link
            to="/products"
            search={{ page: 0, q: "" }}
            className="inline-block bg-white text-primary font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors text-lg"
          >
            Ver todos os produtos
          </Link>
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-black dark:text-white">Produtos em destaque</h2>
          <Link to="/products" search={{ page: 0, q: "" }} className="text-primary hover:underline text-sm font-medium">
            Ver todos →
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-stroke p-6 animate-pulse dark:bg-boxdark dark:border-strokedark"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-100 rounded mb-1" />
                <div className="h-3 bg-gray-100 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.content.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-black text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Sua opinião importa</h2>
          <p className="text-gray-400 mb-8">
            Ajude a comunidade compartilhando sua experiência com os produtos.
          </p>
          <Link
            to="/products"
            search={{ page: 0, q: "" }}
            className="inline-block bg-primary hover:bg-opacity-90 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Avaliar um produto
          </Link>
        </div>
      </section>
    </div>
  );
};
