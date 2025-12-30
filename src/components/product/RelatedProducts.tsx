import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import type { ProductWithImages } from "@/lib/supabase/types";

interface RelatedProductsProps {
  products: ProductWithImages[];
  currentProductId: string;
}

export function RelatedProducts({
  products,
  currentProductId,
}: RelatedProductsProps) {
  const relatedProducts = products
    .filter((p) => p.id !== currentProductId)
    .slice(0, 4);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16">
      <h2 className="mb-6 text-2xl font-bold text-burgundy-900">
        Produk Lainnya
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {relatedProducts.map((product) => {
          const primaryImage =
            product.product_images.find((img) => img.is_primary) ||
            product.product_images[0];

          return (
            <Link key={product.id} href={`/produk/${product.id}`}>
              <Card className="group cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="relative aspect-square overflow-hidden bg-cream-200">
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
                  <div className="absolute inset-0 bg-burgundy-900/0 transition-colors group-hover:bg-burgundy-900/10" />
                </div>
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
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
