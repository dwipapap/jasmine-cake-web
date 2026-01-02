"use client";

import { useState } from "react";
import Image from "next/image";
import { Quote, Star, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TestimonialModal } from "./TestimonialModal";
import type { Testimonial, Product } from "@/lib/supabase/types";

type TestimonialWithProduct = Testimonial & {
  products: Product | null;
};

interface TestimonialCardProps {
  testimonial: TestimonialWithProduct;
  featured?: boolean;
}

export function TestimonialCard({ testimonial, featured = false }: TestimonialCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      <>
        <Card 
          className="group relative h-full overflow-hidden border-0 bg-cream-50 shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-burgundy-900/10 rounded-2xl sm:rounded-3xl cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <Image
              src={testimonial.image_url!}
              alt={testimonial.customer_name}
              fill
              className="object-cover transition-transform duration-700 will-change-transform group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

            {testimonial.products && (
              <div className="absolute left-2 top-2 sm:left-4 sm:top-4 overflow-hidden rounded-full border border-white/20 bg-white/90 shadow-sm">
                <div className="px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-semibold tracking-wide text-burgundy-800 uppercase">
                   {testimonial.products.name}
                </div>
              </div>
            )}

            {featured && (
              <div className="absolute right-2 top-2 sm:right-4 sm:top-4">
                <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-gold shadow-lg shadow-black/20">
                   <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-white text-white" />
                </div>
              </div>
            )}
          </div>

          <div className="relative flex flex-col p-3 sm:p-6">
            <div className="mb-2 sm:mb-4">
              <h3 className="font-serif text-xs sm:text-xl font-bold leading-tight text-burgundy-900 group-hover:text-burgundy-700 transition-colors line-clamp-3 sm:line-clamp-none">
                &quot;{testimonial.message}&quot;
              </h3>
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-burgundy-100/50 pt-2 sm:pt-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex h-6 w-6 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-burgundy-100 text-burgundy-700 font-serif font-bold text-xs sm:text-lg">
                  {testimonial.customer_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-[10px] sm:text-sm font-bold text-burgundy-900">{testimonial.customer_name}</p>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-2 w-2 sm:h-3 sm:w-3",
                          i < starRating ? "fill-gold text-gold" : "fill-cream-300 text-cream-300"
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-cream-100 text-burgundy-600 transition-all duration-300 group-hover:bg-burgundy-600 group-hover:text-white">
                <ArrowRight className="h-5 w-5 -rotate-45 transition-transform duration-300 group-hover:rotate-0" />
              </div>
            </div>
          </div>
        </Card>
        
        <TestimonialModal
          testimonial={testimonial}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          featured={featured}
        />
      </>
    );
  }

  return (
    <>
      <Card
        className={cn(
          "group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border-0 p-4 sm:p-8 shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-xl cursor-pointer",
          featured 
            ? "bg-gradient-to-br from-cream-50 to-burgundy-50/50 shadow-burgundy-900/5 hover:shadow-burgundy-900/10" 
            : "bg-white hover:shadow-burgundy-900/5"
        )}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="absolute -right-6 -top-6 h-16 w-16 sm:h-32 sm:w-32 opacity-5 transition-transform duration-500 group-hover:scale-110 group-hover:opacity-10">
          <Quote className="h-full w-full text-burgundy-900" />
        </div>

        <div>
          <div className="mb-3 sm:mb-6 flex items-start justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className={cn(
                "flex h-8 w-8 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl shadow-sm font-serif text-sm sm:text-2xl font-bold transition-transform duration-500 group-hover:scale-105",
                featured ? "bg-burgundy-100 text-burgundy-700" : "bg-cream-100 text-burgundy-800"
              )}>
                {testimonial.customer_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="text-xs sm:text-base font-bold text-burgundy-900">{testimonial.customer_name}</h4>
                <p className="text-[8px] sm:text-xs font-medium text-burgundy-400">{formattedDate}</p>
              </div>
            </div>

            {featured && (
              <div className="hidden sm:flex items-center gap-1 rounded-full bg-gold/10 px-2.5 py-1 text-xs font-bold text-gold-600 border border-gold/20">
                <Star className="h-3 w-3 fill-gold text-gold" />
                <span className="text-burgundy-800">Pilihan</span>
              </div>
            )}
          </div>

          <div className="relative z-10">
            <div className="flex gap-0.5 mb-2 sm:mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-2.5 w-2.5 sm:h-4 sm:w-4 transition-all duration-300",
                    i < starRating 
                      ? "fill-gold text-gold group-hover:scale-110" 
                      : "fill-cream-200 text-cream-200"
                  )}
                  style={{ transitionDelay: `${i * 50}ms` }}
                />
              ))}
            </div>
            
            <p className="text-xs sm:text-lg leading-relaxed text-burgundy-800/80 italic font-medium line-clamp-4 sm:line-clamp-none">
              &quot;{testimonial.message}&quot;
            </p>

            {testimonial.products && (
              <div className="mt-2 sm:mt-4 inline-flex items-center text-[10px] sm:text-sm font-semibold text-burgundy-600 transition-colors group-hover:text-burgundy-800">
                <span className="mr-1 sm:mr-2 h-px w-4 sm:w-8 bg-burgundy-200"></span>
                <span className="hidden sm:inline">Review untuk</span> {testimonial.products.name}
              </div>
            )}
          </div>
        </div>
        
        <div className={cn(
          "absolute bottom-0 left-0 h-1 sm:h-1.5 w-full bg-gradient-to-r transition-opacity duration-300 opacity-50 group-hover:opacity-100",
          featured ? "from-gold via-burgundy-500 to-burgundy-700" : "from-burgundy-200 via-burgundy-400 to-burgundy-600"
        )} />
      </Card>
      
      <TestimonialModal
        testimonial={testimonial}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        featured={featured}
      />
    </>
  );
}
