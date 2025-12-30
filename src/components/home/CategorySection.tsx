import { CategoryCard } from "./CategoryCard";
import { CATEGORIES } from "@/lib/utils";

interface CategorySectionProps {
  categories?: Array<{
    name: string;
    slug: string;
    image_url?: string | null;
    productCount?: number;
    recentImageUrl?: string | null;
  }>;
}

export function CategorySection({ categories }: CategorySectionProps) {
  const displayCategories = categories || CATEGORIES;

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-cream-50/50">
      <div className="absolute inset-0 opacity-[0.4] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#EAB308 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} 
      />
      
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-burgundy-100/30 to-transparent rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-[700px] h-[700px] bg-gradient-to-tl from-gold/10 to-transparent rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-20 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="h-px w-12 bg-burgundy-200" />
            <span className="text-xs font-bold tracking-[0.2em] text-burgundy-600 uppercase">
              Menu Pilihan
            </span>
            <div className="h-px w-12 bg-burgundy-200" />
          </div>
          
          <h2 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold text-burgundy-950 tracking-tight">
            Kategori <span className="font-serif italic text-burgundy-700">Spesial</span>
          </h2>
          
          <p className="text-lg text-burgundy-700/70 leading-relaxed font-light">
            Temukan kelezatan dalam setiap kategori. Dari kue kering yang renyah hingga
            hidangan utama yang menggugah selera.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {displayCategories.map((category) => {
            const imageUrl = "recentImageUrl" in category && category.recentImageUrl
              ? category.recentImageUrl
              : "image_url" in category
                ? category.image_url ?? undefined
                : undefined;
            
            return (
              <div key={category.slug} className="h-full">
                <CategoryCard
                  name={category.name}
                  slug={category.slug}
                  imageUrl={imageUrl}
                  productCount={"productCount" in category ? category.productCount : undefined}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
