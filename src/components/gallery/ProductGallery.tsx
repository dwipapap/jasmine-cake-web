"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { Card } from "@/components/ui/card";
import type { ProductWithImages } from "@/lib/supabase/types";

const Lightbox = dynamic(() => import("yet-another-react-lightbox"), {
  ssr: false,
});

interface ProductGalleryProps {
  products: ProductWithImages[];
}

export function ProductGallery({ products }: ProductGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [lightboxImages, setLightboxImages] = useState<{ src: string }[]>([]);

  const openLightbox = (product: ProductWithImages, imageIndex: number = 0) => {
    const images = product.product_images.map((img) => ({ src: img.image_url }));
    setLightboxImages(images);
    setLightboxIndex(imageIndex);
  };

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => {
          const primaryImage = product.product_images.find((img) => img.is_primary) ||
            product.product_images[0];

          return (
            <Card
              key={product.id}
              className="group cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className="relative aspect-square overflow-hidden bg-cream-200"
                onClick={() => openLightbox(product)}
              >
                {primaryImage ? (
                  <Image
                    src={primaryImage.image_url}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="text-6xl text-burgundy-300">🍰</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-burgundy-900/0 transition-colors group-hover:bg-burgundy-900/20" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="rounded-full bg-cream-50 px-4 py-2 text-sm font-medium text-burgundy-700">
                    Klik untuk zoom
                  </span>
                </div>
              </div>
              <Link href={`/produk/${product.id}`}>
                <div className="p-4">
                  <h3 className="font-semibold text-burgundy-800 group-hover:text-burgundy-600">
                    {product.name}
                  </h3>
                  {product.categories && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {product.categories.name}
                    </p>
                  )}
                </div>
              </Link>
            </Card>
          );
        })}
      </div>

      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={lightboxImages}
        plugins={[Zoom]}
        carousel={{ finite: true }}
        styles={{
          container: { backgroundColor: "rgba(90, 31, 61, 0.95)" },
        }}
      />
    </>
  );
}
