import type { Metadata } from "next";
import Link from "next/link";
import { CategoryTabs, ProductCard } from "@/components/gallery";
import { createClient } from "@/lib/supabase/server";
import type { ProductWithImages } from "@/lib/supabase/types";
import { PackageOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Galeri Produk",
  description:
    "Lihat galeri produk kue dan makanan homemade dari Jasmine Cake and Cookies",
};

export default async function GaleriPage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
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
        <div className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-burgundy-100/40 blur-3xl" />
        <div className="absolute -right-20 top-40 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />
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
            <p className="mx-auto max-w-2xl text-lg text-burgundy-700/80">
              Jelajahi ragam sajian istimewa kami, mulai dari kue kering renyah, kue basah lembut, hingga tumpeng megah untuk momen spesial Anda.
            </p>
          </div>

          <div className="mb-12">
            <CategoryTabs />
          </div>

          {typedProducts.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {typedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-burgundy-200 bg-white/50 p-12 text-center backdrop-blur-sm">
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
