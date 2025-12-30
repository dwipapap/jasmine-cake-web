"use client";

import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import "yet-another-react-lightbox/styles.css";
import type { ProductImage } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

const Lightbox = dynamic(() => import("yet-another-react-lightbox"), {
  ssr: false,
});

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const sortedImages = [...images].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return a.display_order - b.display_order;
  });

  const currentImage = sortedImages[selectedIndex];

  if (sortedImages.length === 0) {
    return (
      <div className="aspect-square w-full overflow-hidden rounded-xl bg-cream-200">
        <div className="flex h-full items-center justify-center">
          <span className="text-8xl text-burgundy-300">🍰</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div
          className="relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-xl bg-cream-200"
          onClick={() => setLightboxOpen(true)}
        >
          <Image
            src={currentImage.image_url}
            alt={productName}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {sortedImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {sortedImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                  selectedIndex === index
                    ? "border-burgundy-600 ring-2 ring-burgundy-300"
                    : "border-transparent hover:border-burgundy-300"
                )}
              >
                <Image
                  src={image.image_url}
                  alt={`${productName} ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={selectedIndex}
        slides={sortedImages.map((img) => ({
          src: img.image_url,
          alt: productName,
        }))}
        on={{
          view: ({ index }) => setSelectedIndex(index),
        }}
      />
    </>
  );
}
