import type { Metadata } from "next";
import { ImageGalleryGrid } from "@/components/gallery/ImageGalleryGrid";
import { createClient } from "@/lib/supabase/server";
import type { ProductWithImages } from "@/lib/supabase/types";
import { Images } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Portfolio Foto",
  description: "Galeri lengkap semua foto produk dari Jasmine Cake and Cookies",
};

export default async function FotoPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select(
      `
      *,
      product_images (*),
      categories (*)
    `
    )
    .eq("is_available", true)
    .order("created_at", { ascending: false });

  const typedProducts = (products as ProductWithImages[]) || [];

  const allImages = typedProducts.flatMap((product) =>
    product.product_images.map((image) => ({
      id: image.id,
      url: image.image_url,
      productName: product.name,
      productId: product.id,
      categoryName: product.categories?.name || "Tanpa Kategori",
      categorySlug: product.categories?.slug || "",
    }))
  );

  const totalImages = allImages.length;

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-gradient-to-br from-burgundy-100/40 to-transparent opacity-60" />
        <div className="absolute -right-20 top-40 h-80 w-80 rounded-full bg-gradient-to-bl from-gold/10 to-transparent opacity-60" />
      </div>

      <div className="relative pb-24 pt-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Link
              href="/galeri"
              className="mb-4 inline-flex items-center gap-2 text-sm text-burgundy-600 hover:text-burgundy-800 transition-colors"
            >
              ← Kembali ke Galeri Produk
            </Link>
            <span className="mb-3 inline-block rounded-full bg-burgundy-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-burgundy-700">
              Portfolio
            </span>
            <h1 className="mb-4 font-serif text-4xl font-bold text-burgundy-900 md:text-5xl lg:text-6xl">
              Semua Foto
            </h1>
            <p className="mx-auto mb-3 max-w-2xl text-lg text-burgundy-700/80">
              Jelajahi {totalImages} foto dari koleksi kami
            </p>
          </div>

          {allImages.length > 0 ? (
            <ImageGalleryGrid images={allImages} />
          ) : (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-burgundy-200 bg-white/50 p-12 text-center shadow-sm">
              <div className="mb-6 rounded-full bg-burgundy-50 p-6">
                <Images className="h-12 w-12 text-burgundy-300" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-burgundy-800">
                Belum Ada Foto
              </h3>
              <p className="max-w-md text-burgundy-600">
                Belum ada foto yang tersedia untuk ditampilkan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
