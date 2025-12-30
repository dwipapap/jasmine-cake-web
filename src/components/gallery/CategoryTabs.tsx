import Link from "next/link";
import { CATEGORIES } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { 
  Cookie, 
  Cake, 
  UtensilsCrossed, 
  Package, 
  Crown, 
  LayoutGrid 
} from "lucide-react";

interface CategoryTabsProps {
  activeCategory?: string;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "": LayoutGrid,
  "kue-kering": Cookie,
  "kue-basah": Cake,
  "nasi-kotak": UtensilsCrossed,
  "snack-box": Package,
  "tumpeng": Crown,
};

export function CategoryTabs({ activeCategory }: CategoryTabsProps) {
  const categories = [{ name: "Semua", slug: "" }, ...CATEGORIES];

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {categories.map((category) => {
        const isActive = activeCategory === category.slug;
        const Icon = CATEGORY_ICONS[category.slug] || Package;

        return (
          <Link
            key={category.slug}
            href={category.slug ? `/galeri/${category.slug}` : "/galeri"}
            className="group relative"
          >
            <div
              className={cn(
                "flex items-center gap-2 overflow-hidden rounded-full border px-6 py-3 text-sm font-medium transition-all duration-300",
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
              <span className="relative z-10">
                {category.name}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
