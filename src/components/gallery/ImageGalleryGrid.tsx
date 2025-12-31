"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

const Lightbox = dynamic(() => import("yet-another-react-lightbox"), {
  ssr: false,
});

interface ImageItem {
  id: string;
  url: string;
  productName: string;
  productId: string;
  categoryName: string;
  categorySlug: string;
}

interface ImageGalleryGridProps {
  images: ImageItem[];
}

export function ImageGalleryGrid({ images }: ImageGalleryGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const uniqueCategories = new Set(images.map((img) => img.categoryName));
    return Array.from(uniqueCategories).sort();
  }, [images]);

  const filteredImages = useMemo(() => {
    if (selectedCategory === "all") return images;
    return images.filter((img) => img.categoryName === selectedCategory);
  }, [images, selectedCategory]);

  const lightboxSlides = filteredImages.map((img) => ({ src: img.url }));

  return (
    <>
      {categories.length > 1 && (
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              selectedCategory === "all"
                ? "bg-burgundy-600 text-white shadow-md"
                : "bg-white text-burgundy-700 hover:bg-burgundy-50"
            }`}
          >
            Semua ({images.length})
          </button>
          {categories.map((category) => {
            const count = images.filter((img) => img.categoryName === category).length;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-burgundy-600 text-white shadow-md"
                    : "bg-white text-burgundy-700 hover:bg-burgundy-50"
                }`}
              >
                {category} ({count})
              </button>
            );
          })}
        </div>
      )}

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
        {filteredImages.map((image, index) => (
          <div
            key={image.id}
            className="group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl"
          >
            <div
              className="relative cursor-pointer overflow-hidden"
              onClick={() => setLightboxIndex(index)}
            >
              <Image
                src={image.url}
                alt={image.productName}
                width={600}
                height={600}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-burgundy-900 shadow-lg">
                  Klik untuk zoom
                </span>
              </div>
            </div>

            <Link
              href={`/produk/${image.productId}`}
              className="block p-4 hover:bg-cream-50 transition-colors"
            >
              <h3 className="font-semibold text-burgundy-900 group-hover:text-burgundy-700 transition-colors">
                {image.productName}
              </h3>
              <p className="mt-1 text-xs text-burgundy-600/70">{image.categoryName}</p>
            </Link>
          </div>
        ))}
      </div>

      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={lightboxSlides}
        plugins={[Zoom]}
        carousel={{ finite: true }}
        styles={{
          container: { backgroundColor: "rgba(90, 31, 61, 0.95)" },
        }}
      />
    </>
  );
}
