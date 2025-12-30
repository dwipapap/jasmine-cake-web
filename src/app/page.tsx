import { HeroSection, CategorySection } from "@/components/home";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/supabase/types";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: categoriesData } = await supabase
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true });

  const categories = (categoriesData || []) as Category[];

  const categoriesWithCountsAndImages = await Promise.all(
    categories.map(async (category) => {
      const { count } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("category_id", category.id)
        .eq("is_available", true);

      const { data: recentProduct } = await supabase
        .from("products")
        .select(`
          id,
          product_images (image_url, is_primary)
        `)
        .eq("category_id", category.id)
        .eq("is_available", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      let recentImageUrl: string | null = null;
      if (recentProduct?.product_images && recentProduct.product_images.length > 0) {
        const primaryImage = recentProduct.product_images.find((img: { is_primary: boolean }) => img.is_primary);
        recentImageUrl = primaryImage?.image_url || recentProduct.product_images[0]?.image_url || null;
      }

      return {
        ...category,
        productCount: count || 0,
        recentImageUrl,
      };
    })
  );

  return (
    <>
      <HeroSection />
      <CategorySection categories={categoriesWithCountsAndImages} />
    </>
  );
}
