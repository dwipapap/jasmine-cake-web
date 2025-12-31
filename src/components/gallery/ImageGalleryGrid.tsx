"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { cn, CATEGORIES } from "@/lib/utils";
import { 
  ZoomIn, 
  ArrowRight,
  Cookie, 
  Cake, 
  UtensilsCrossed, 
  Package, 
  Crown, 
  LayoutGrid,
  Filter
} from "lucide-react";
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

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "all": LayoutGrid,
  "kue-kering": Cookie,
  "kue-basah": Cake,
  "nasi-kotak": UtensilsCrossed,
  "snack-box": Package,
  "tumpeng": Crown,
};

export function ImageGalleryGrid({ images }: ImageGalleryGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const uniqueSlugs = new Set(images.map((img) => img.categorySlug));
    const presentCategories = CATEGORIES.filter(c => uniqueSlugs.has(c.slug));
    
    return [{ name: "Semua", slug: "all" }, ...presentCategories];
  }, [images]);

  const filteredImages = useMemo(() => {
    if (selectedCategory === "all") return images;
    return images.filter((img) => img.categorySlug === selectedCategory);
  }, [images, selectedCategory]);

  const lightboxSlides = filteredImages.map((img) => ({ src: img.url }));

  return (
    <>
      <div className="mb-10 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-burgundy-600/70 font-medium uppercase tracking-widest">
          <Filter className="h-4 w-4" />
          <span>Filter Kategori</span>
        </div>
        
        <div className="flex w-full overflow-x-auto py-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:justify-center scrollbar-hide gap-3">
          {categories.map((category) => {
            const Icon = CATEGORY_ICONS[category.slug] || Package;
            const isActive = selectedCategory === category.slug;
            const count = category.slug === "all" 
              ? images.length 
              : images.filter((img) => img.categorySlug === category.slug).length;

            return (
              <button
                key={category.slug}
                onClick={() => setSelectedCategory(category.slug)}
                className={cn(
                  "group relative flex items-center gap-2 overflow-hidden rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300 flex-shrink-0",
                  isActive
                    ? "border-burgundy-400 bg-burgundy-700 text-white shadow-[0_4px_12px_rgba(109,45,77,0.3)] ring-2 ring-gold ring-offset-2 ring-offset-cream-50"
                    : "border-burgundy-200 bg-white text-burgundy-700 shadow-sm hover:-translate-y-0.5 hover:border-burgundy-300 hover:bg-cream-50 hover:shadow-md"
                )}
              >
                <Icon 
                  className={cn(
                    "h-4 w-4 transition-transform duration-300",
                    isActive ? "scale-110" : "group-hover:scale-110"
                  )} 
                />
                <span className="relative z-10 whitespace-nowrap">
                  {category.name}
                  <span className={cn("ml-1.5 text-xs opacity-70", isActive ? "text-white" : "text-burgundy-500")}>
                    {count}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4 space-y-6">
        {filteredImages.map((image, index) => (
          <div
            key={image.id}
            className="group relative break-inside-avoid overflow-hidden rounded-3xl bg-burgundy-900 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-burgundy-900/20"
          >
            <div
              className="relative cursor-zoom-in overflow-hidden"
              onClick={() => setLightboxIndex(index)}
            >
              <Image
                src={image.url}
                alt={image.productName}
                width={600}
                height={800}
                className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950/90 via-burgundy-900/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-90" />
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm transition-transform duration-300 hover:bg-white/30 hover:scale-110">
                  <ZoomIn className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full p-5 text-white pointer-events-none">
              <div className="transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                <span className="mb-2 inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                  {image.categoryName}
                </span>
                
                <h3 className="font-serif text-xl font-bold leading-tight tracking-tight text-white mb-2">
                  {image.productName}
                </h3>
                
                <Link
                  href={`/produk/${image.productId}`}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold opacity-0 pointer-events-auto transition-all duration-300 group-hover:opacity-100 hover:text-white"
                  onClick={(e) => e.stopPropagation()} 
                >
                  <span>Lihat Produk</span>
                  <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
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
          container: { backgroundColor: "rgba(35, 10, 20, 0.95)" },
        }}
      />
    </>
  );
}