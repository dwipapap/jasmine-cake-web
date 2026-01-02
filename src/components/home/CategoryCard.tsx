import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { 
  ArrowRight, 
  Cookie, 
  Cake, 
  UtensilsCrossed, 
  Package, 
  Crown 
} from "lucide-react";

interface CategoryCardProps {
  name: string;
  slug: string;
  imageUrl?: string;
  productCount?: number;
}

const iconMap: Record<string, React.ElementType> = {
  "kue-kering": Cookie,
  "kue-basah": Cake,
  "nasi-kotak": UtensilsCrossed,
  "snack-box": Package,
  tumpeng: Crown,
};

export function CategoryCard({
  name,
  slug,
  imageUrl,
  productCount,
}: CategoryCardProps) {
  const Icon = iconMap[slug] || UtensilsCrossed;
  const hasImage = !!imageUrl;

  return (
    <Link href={`/galeri/${slug}`} className="group block h-full w-full">
      <Card className={`relative h-full min-h-[180px] sm:min-h-[280px] w-full overflow-hidden rounded-2xl sm:rounded-3xl border-0 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-burgundy-900/20 ${hasImage ? 'bg-burgundy-900' : 'bg-cream-50'}`}>
        
        <div className="absolute inset-0 z-0">
          {hasImage ? (
            <>
              <Image
                src={imageUrl || ''}
                alt={name}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90" />
            </>
          ) : (
            <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-cream-50 via-white to-cream-100">
                <div className="absolute inset-0 opacity-[0.03]" 
                     style={{ backgroundImage: 'radial-gradient(#7C3A3E 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
                />
                <div className="absolute inset-0 flex items-center justify-center pb-12 sm:pb-16">
                    <Icon 
                        strokeWidth={1} 
                        className="h-16 w-16 sm:h-32 sm:w-32 text-burgundy-900/10 transition-all duration-500 group-hover:scale-110 group-hover:text-burgundy-900/20" 
                    />
                </div>
            </div>
          )}
        </div>

        <div className={`absolute right-2 top-2 sm:right-4 sm:top-4 z-10 flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-full shadow-sm transition-transform duration-300 group-hover:scale-110 ${hasImage ? 'bg-white/20 text-white border border-white/30' : 'bg-white text-burgundy-700 shadow-md border border-burgundy-100'}`}>
           <Icon className="h-4 w-4 sm:h-6 sm:w-6" strokeWidth={1.5} />
        </div>

        <div className="absolute bottom-0 left-0 z-10 w-full p-3 sm:p-6">
           <div className="flex flex-col gap-1 sm:gap-3">
              <h3 className={`text-sm sm:text-2xl font-serif font-bold tracking-tight transition-colors duration-300 ${hasImage ? 'text-white' : 'text-burgundy-950 group-hover:text-burgundy-700'}`}>
                {name}
              </h3>

              <div className="flex items-center justify-between">
                 {productCount !== undefined && productCount > 0 && (
                   <div className={`flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm font-medium ${hasImage ? 'text-white/80' : 'text-burgundy-400'}`}>
                      <span>{productCount} Items</span>
                   </div>
                 )}
                 
                 <div className={`flex items-center gap-1 sm:gap-2 transition-all duration-300 ${hasImage ? 'text-white' : 'text-burgundy-600'}`}>
                    <span className={`text-[8px] sm:text-xs font-bold uppercase tracking-widest opacity-0 transform translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 hidden sm:inline ${hasImage ? 'text-white' : 'text-burgundy-800'}`}>
                        Lihat
                    </span>
                    <div className={`flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full border transition-all duration-300 ${hasImage ? 'border-white/30 bg-white/10 group-hover:bg-white group-hover:text-burgundy-900' : 'border-burgundy-200 bg-white group-hover:border-burgundy-600 group-hover:bg-burgundy-600 group-hover:text-white'}`}>
                        <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </Card>
    </Link>
  );
}
