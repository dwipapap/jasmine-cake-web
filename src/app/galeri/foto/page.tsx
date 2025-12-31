import type { Metadata } from "next";
import { ImageGalleryGrid } from "@/components/gallery";
import { createClient } from "@/lib/supabase/server";
import type { ProductWithImages } from "@/lib/supabase/types";
import { Images, ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen bg-cream-50 relative">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(#7C3A3E 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
        />
        <div className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-burgundy-100/30 blur-3xl" />
        <div className="absolute right-0 top-1/4 h-[500px] w-[500px] rounded-full bg-gold/5 blur-3xl" />
      </div>

      <div className="relative z-10 pb-24 pt-12">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex flex-col items-center text-center">
            <Link
              href="/galeri"
              className="group mb-8 flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-burgundy-700 shadow-sm ring-1 ring-burgundy-100 transition-all hover:bg-burgundy-50 hover:ring-burgundy-200 hover:shadow-md"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Kembali ke Galeri
            </Link>
            
            <div className="relative mb-4">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.2em] text-burgundy-400">
                Dapur Keluarga
              </span>
              <h1 className="font-serif text-4xl font-bold text-burgundy-900 md:text-6xl lg:text-7xl">
                Portfolio Foto
              </h1>
            </div>
            
            <p className="mx-auto max-w-2xl text-lg text-burgundy-700/80 leading-relaxed">
              Kumpulan momen manis dan kreasi lezat dari dapur kami.
              <span className="block mt-1 text-sm font-medium text-burgundy-500">
                Menampilkan {totalImages} foto
              </span>
            </p>
          </div>

          {allImages.length > 0 ? (
            <ImageGalleryGrid images={allImages} />
          ) : (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-burgundy-200 bg-white/50 p-12 text-center shadow-sm backdrop-blur-sm">
              <div className="mb-6 rounded-full bg-burgundy-50 p-6">
                <Images className="h-12 w-12 text-burgundy-300" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-burgundy-800">
                Belum Ada Foto
              </h3>
              <p className="max-w-md text-burgundy-600">
                Belum ada foto yang tersedia untuk ditampilkan saat ini.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}