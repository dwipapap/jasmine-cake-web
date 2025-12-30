import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ArrowRight, Cake } from "lucide-react";
import type { ProductWithImages } from "@/lib/supabase/types";

interface ProductCardProps {
  product: ProductWithImages;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage =
    product.product_images.find((img) => img.is_primary) ||
    product.product_images[0];

  const hasImage = !!primaryImage;

  return (
    <Link href={`/produk/${product.id}`} className="group block h-full w-full">
      <Card className={`relative h-full min-h-[320px] w-full overflow-hidden rounded-3xl border-0 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-burgundy-900/20 ${hasImage ? 'bg-burgundy-900' : 'bg-cream-50'}`}>
        
        <div className="absolute inset-0 z-0">
          {hasImage ? (
            <>
              <Image
                src={primaryImage.image_url}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-95" />
            </>
          ) : (
            <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-cream-50 via-white to-cream-100">
                <div className="absolute inset-0 opacity-[0.03]" 
                     style={{ backgroundImage: 'radial-gradient(#7C3A3E 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
                />
                <div className="absolute inset-0 flex items-center justify-center pb-16">
                    <Cake 
                        strokeWidth={1} 
                        className="h-32 w-32 text-burgundy-900/10 transition-all duration-500 group-hover:scale-110 group-hover:text-burgundy-900/20" 
                    />
                </div>
            </div>
          )}
        </div>

        {product.categories && (
          <div className="absolute left-4 top-4 z-10">
            <span className={`inline-flex items-center rounded-full backdrop-blur-md px-3 py-1 text-xs font-medium shadow-sm ring-1 transition-all duration-300 ${
              hasImage 
                ? 'bg-white/20 text-white ring-white/30' 
                : 'bg-white/80 text-burgundy-700 ring-burgundy-100'
            }`}>
              {product.categories.name}
            </span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 z-10 w-full p-6">
           <div className="flex flex-col gap-2">
              <h3 className={`text-2xl font-serif font-bold tracking-tight transition-colors duration-300 ${hasImage ? 'text-white' : 'text-burgundy-950 group-hover:text-burgundy-700'}`}>
                {product.name}
              </h3>

              {product.description && (
                <p className={`line-clamp-2 text-sm leading-relaxed transition-colors duration-300 ${hasImage ? 'text-white/80' : 'text-burgundy-600/80'}`}>
                  {product.description}
                </p>
              )}

              <div className="mt-2 flex items-center justify-end">
                 <div className={`flex items-center gap-2 transition-all duration-300 ${hasImage ? 'text-white' : 'text-burgundy-600'}`}>
                    <span className={`text-xs font-bold uppercase tracking-widest opacity-0 transform translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 ${hasImage ? 'text-white' : 'text-burgundy-800'}`}>
                        Lihat Detail
                    </span>
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 ${hasImage ? 'border-white/30 bg-white/10 group-hover:bg-white group-hover:text-burgundy-900' : 'border-burgundy-200 bg-white group-hover:border-burgundy-600 group-hover:bg-burgundy-600 group-hover:text-white'}`}>
                        <ArrowRight className="h-4 w-4" />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </Card>
    </Link>
  );
}
