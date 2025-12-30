import Image from "next/image";
import { Quote, Star, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Testimonial, Product } from "@/lib/supabase/types";

type TestimonialWithProduct = Testimonial & {
  products: Product | null;
};

interface TestimonialCardProps {
  testimonial: TestimonialWithProduct;
  featured?: boolean;
}

export function TestimonialCard({ testimonial, featured = false }: TestimonialCardProps) {
  const starRating = 'rating' in testimonial ? (testimonial as unknown as { rating: number }).rating : 5;
  const hasImage = !!testimonial.image_url;

  const formattedDate = testimonial.created_at 
    ? new Date(testimonial.created_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : '';

  if (hasImage) {
    return (
      <Card className="group relative h-full overflow-hidden border-0 bg-cream-50 shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-burgundy-900/10 rounded-3xl">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={testimonial.image_url!}
            alt={testimonial.customer_name}
            fill
            className="object-cover transition-transform duration-700 will-change-transform group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

          {testimonial.products && (
            <div className="absolute left-4 top-4 overflow-hidden rounded-full border border-white/20 bg-white/90 shadow-sm">
              <div className="px-3 py-1.5 text-xs font-semibold tracking-wide text-white uppercase">
                 {testimonial.products.name}
              </div>
            </div>
          )}

          {featured && (
            <div className="absolute right-4 top-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold shadow-lg shadow-black/20">
                 <Star className="h-4 w-4 fill-white text-white" />
              </div>
            </div>
          )}
        </div>

        <div className="relative flex flex-col p-6">
          <div className="mb-4">
            <h3 className="font-serif text-xl font-bold leading-tight text-burgundy-900 group-hover:text-burgundy-700 transition-colors">
              &quot;{testimonial.message}&quot;
            </h3>
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-burgundy-100/50 pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-burgundy-100 text-burgundy-700 font-serif font-bold text-lg">
                {testimonial.customer_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-burgundy-900">{testimonial.customer_name}</p>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-3 w-3",
                        i < starRating ? "fill-gold text-gold" : "fill-cream-300 text-cream-300"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cream-100 text-burgundy-600 transition-all duration-300 group-hover:bg-burgundy-600 group-hover:text-white">
              <ArrowRight className="h-5 w-5 -rotate-45 transition-transform duration-300 group-hover:rotate-0" />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border-0 p-8 shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-xl",
        featured 
          ? "bg-gradient-to-br from-cream-50 to-burgundy-50/50 shadow-burgundy-900/5 hover:shadow-burgundy-900/10" 
          : "bg-white hover:shadow-burgundy-900/5"
      )}
    >
      <div className="absolute -right-6 -top-6 h-32 w-32 opacity-5 transition-transform duration-500 group-hover:scale-110 group-hover:opacity-10">
        <Quote className="h-full w-full text-burgundy-900" />
      </div>

      <div>
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={cn(
              "flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm font-serif text-2xl font-bold transition-transform duration-500 group-hover:scale-105",
              featured ? "bg-burgundy-100 text-burgundy-700" : "bg-cream-100 text-burgundy-800"
            )}>
              {testimonial.customer_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="font-bold text-burgundy-900">{testimonial.customer_name}</h4>
              <p className="text-xs font-medium text-burgundy-400">{formattedDate}</p>
            </div>
          </div>

          {featured && (
            <div className="flex items-center gap-1 rounded-full bg-gold/10 px-2.5 py-1 text-xs font-bold text-gold-600 border border-gold/20">
              <Star className="h-3 w-3 fill-gold text-gold" />
              <span className="text-burgundy-800">Pilihan</span>
            </div>
          )}
        </div>

        <div className="relative z-10">
          <div className="flex gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4 transition-all duration-300",
                  i < starRating 
                    ? "fill-gold text-gold group-hover:scale-110" 
                    : "fill-cream-200 text-cream-200"
                )}
                style={{ transitionDelay: `${i * 50}ms` }}
              />
            ))}
          </div>
          
          <p className="text-lg leading-relaxed text-burgundy-800/80 italic font-medium">
            &quot;{testimonial.message}&quot;
          </p>

          {testimonial.products && (
            <div className="mt-4 inline-flex items-center text-sm font-semibold text-burgundy-600 transition-colors group-hover:text-burgundy-800">
              <span className="mr-2 h-px w-8 bg-burgundy-200"></span>
              Review untuk {testimonial.products.name}
            </div>
          )}
        </div>
      </div>
      
      <div className={cn(
        "absolute bottom-0 left-0 h-1.5 w-full bg-gradient-to-r transition-opacity duration-300 opacity-50 group-hover:opacity-100",
        featured ? "from-gold via-burgundy-500 to-burgundy-700" : "from-burgundy-200 via-burgundy-400 to-burgundy-600"
      )} />
    </Card>
  );
}
