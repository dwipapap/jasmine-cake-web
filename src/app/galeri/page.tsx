import type { Metadata } from "next";
import { CategoryTabs, ProductCard } from "@/components/gallery";
import { createClient } from "@/lib/supabase/server";
import type { ProductWithImages } from "@/lib/supabase/types";
import { PackageOpen, Images } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Galeri Produk",
  description:
    "Lihat galeri produk kue dan makanan homemade dari Jasmine Cake and Cookies",
};

export default async function GaleriPage() {
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

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-gradient-to-br from-burgundy-100/40 to-transparent opacity-60" />
        <div className="absolute -right-20 top-40 h-80 w-80 rounded-full bg-gradient-to-bl from-gold/10 to-transparent opacity-60" />
      </div>

      <div className="relative pb-24 pt-16">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <span className="mb-3 inline-block rounded-full bg-burgundy-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-burgundy-700">
              Koleksi Dapur Keluarga
            </span>
            <h1 className="mb-6 font-serif text-4xl font-bold text-burgundy-900 md:text-5xl lg:text-6xl">
              Galeri Kelezatan
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-burgundy-700/80 mb-6">
              Jelajahi ragam sajian istimewa kami, mulai dari kue kering renyah, kue basah lembut, hingga tumpeng megah untuk momen spesial Anda.
            </p>
            <Link
              href="/galeri/foto"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-burgundy-200 bg-white px-6 py-3 text-sm font-medium text-burgundy-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-burgundy-300 hover:bg-cream-50 hover:shadow-md"
            >
              <Images className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              <span className="relative z-10 whitespace-nowrap">
                Lihat Semua Foto Portfolio
              </span>
            </Link>
          </div>

          <div className="mb-12">
            <CategoryTabs />
          </div>

          {typedProducts.length > 0 ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {typedProducts.map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  priority={index < 4}
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-burgundy-200 bg-white/50 p-12 text-center shadow-sm">
              <div className="mb-6 rounded-full bg-burgundy-50 p-6">
                <PackageOpen className="h-12 w-12 text-burgundy-300" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-burgundy-800">
                Belum Ada Produk
              </h3>
              <p className="max-w-md text-burgundy-600">
                Koleksi lezat kami sedang disiapkan. Silakan kembali lagi nanti untuk melihat menu terbaru kami.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
