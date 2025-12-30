import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ProductImageGallery,
  ProductInfo,
  RelatedProducts,
} from "@/components/product";
import { createClient } from "@/lib/supabase/server";
import type { ProductWithImages } from "@/lib/supabase/types";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("products")
    .select("name, description")
    .eq("id", id)
    .single();

  const product = data as { name: string; description: string | null } | null;

  if (!product) {
    return {
      title: "Produk Tidak Ditemukan",
    };
  }

  return {
    title: product.name,
    description: product.description || `${product.name} dari Jasmine Cake and Cookies`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: productData } = await supabase
    .from("products")
    .select(
      `
      *,
      product_images (*),
      categories (*)
    `
    )
    .eq("id", id)
    .single();

  const product = productData as ProductWithImages | null;

  if (!product) {
    notFound();
  }

  let relatedProducts: ProductWithImages[] = [];

  if (product.category_id) {
    const { data: relatedData } = await supabase
      .from("products")
      .select(
        `
        *,
        product_images (*),
        categories (*)
      `
      )
      .eq("category_id", product.category_id)
      .eq("is_available", true)
      .neq("id", id)
      .limit(4);

    relatedProducts = (relatedData || []) as ProductWithImages[];
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <ProductImageGallery
            images={product.product_images}
            productName={product.name}
          />
          <ProductInfo product={product} />
        </div>

        {relatedProducts.length > 0 && (
          <RelatedProducts
            products={relatedProducts}
            currentProductId={product.id}
          />
        )}
      </div>
    </div>
  );
}
