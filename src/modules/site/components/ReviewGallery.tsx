import { useState } from "react";
import { Expand } from "lucide-react";
import { Lightbox } from "@/shared/components/lightbox";
import { resolveApiUrl } from "@/shared/services/api";
import type { ReviewImage } from "@/shared/types/review";

interface ReviewGalleryProps {
  images: ReviewImage[];
  /** Nome do autor, usado no texto alternativo */
  author: string;
  /** Título da avaliação, usado no texto alternativo */
  title: string;
}

/** Miniaturas das fotos de uma avaliação; cada uma abre o lightbox acessível. */
export const ReviewGallery = ({ images, author, title }: ReviewGalleryProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  if (images.length === 0) return null;

  const items = images.map((image, idx) => ({
    src: resolveApiUrl(image.url),
    alt: `Foto ${idx + 1} de ${images.length} enviada por ${author} na avaliação “${title}”`,
  }));

  return (
    <>
      <ul className="mt-4 flex flex-wrap gap-2" aria-label={`Fotos da avaliação (${images.length})`}>
        {items.map((item, idx) => (
          <li key={images[idx].id}>
            <button
              type="button"
              onClick={() => setOpenIndex(idx)}
              className="group/thumb relative block h-20 w-20 overflow-hidden rounded-xl border border-line bg-canvas sm:h-24 sm:w-24"
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-200 motion-safe:group-hover/thumb:scale-105"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center bg-[#0B1120]/0 text-white opacity-0 transition-opacity group-hover/thumb:bg-[#0B1120]/35 group-hover/thumb:opacity-100"
              >
                <Expand className="h-5 w-5" />
              </span>
              <span className="sr-only"> (ampliar)</span>
            </button>
          </li>
        ))}
      </ul>
      <Lightbox
        images={items}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onIndexChange={setOpenIndex}
        label={`Fotos da avaliação de ${author}`}
      />
    </>
  );
};
