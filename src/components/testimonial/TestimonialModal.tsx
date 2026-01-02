"use client";

import { useEffect, useCallback, useState } from "react";
import Image from "next/image";
import { X, Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Testimonial, Product } from "@/lib/supabase/types";

type TestimonialWithProduct = Testimonial & {
  products: Product | null;
};

interface TestimonialModalProps {
  testimonial: TestimonialWithProduct;
  isOpen: boolean;
  onClose: () => void;
  featured?: boolean;
}

export function TestimonialModal({ testimonial, isOpen, onClose, featured = false }: TestimonialModalProps) {
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);

  const starRating = 'rating' in testimonial ? (testimonial as unknown as { rating: number }).rating : 5;
  const hasImage = !!testimonial.image_url;

  const formattedDate = testimonial.created_at 
    ? new Date(testimonial.created_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : '';

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setIsRendered(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isRendered) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isRendered, handleKeyDown]);

  if (!isRendered) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60" />
      
      <div 
        className={cn(
          "relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-cream-50 shadow-2xl transition-transform duration-300 ease-out",
          isVisible ? "scale-100" : "scale-95"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-burgundy-700 shadow-md transition-all hover:bg-white hover:scale-110"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {hasImage && (
          <div className="relative aspect-video w-full overflow-hidden rounded-t-2xl">
            <Image
              src={testimonial.image_url!}
              alt={testimonial.customer_name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 500px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            
            {testimonial.products && (
              <div className="absolute left-4 top-4 overflow-hidden rounded-full border border-white/20 bg-white/90 shadow-sm">
                <div className="px-3 py-1.5 text-xs font-semibold tracking-wide text-burgundy-800 uppercase">
                  {testimonial.products.name}
                </div>
              </div>
            )}

            {featured && (
              <div className="absolute right-12 top-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold shadow-lg">
                  <Star className="h-4 w-4 fill-white text-white" />
                </div>
              </div>
            )}
          </div>
        )}

        <div className={cn("p-6", !hasImage && "pt-12")}>
          {!hasImage && (
            <div className="absolute -right-4 -top-4 h-24 w-24 opacity-10">
              <Quote className="h-full w-full text-burgundy-900" />
            </div>
          )}

          <div className="mb-4 flex items-center gap-4">
            <div className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl shadow-sm font-serif text-xl font-bold",
              featured ? "bg-burgundy-100 text-burgundy-700" : "bg-cream-200 text-burgundy-800"
            )}>
              {testimonial.customer_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="font-bold text-burgundy-900">{testimonial.customer_name}</h4>
              <p className="text-xs font-medium text-burgundy-400">{formattedDate}</p>
            </div>
            {featured && (
              <div className="ml-auto flex items-center gap-1 rounded-full bg-gold/10 px-2.5 py-1 text-xs font-bold border border-gold/20">
                <Star className="h-3 w-3 fill-gold text-gold" />
                <span className="text-burgundy-800">Pilihan</span>
              </div>
            )}
          </div>

          <div className="mb-4 flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-5 w-5",
                  i < starRating ? "fill-gold text-gold" : "fill-cream-200 text-cream-200"
                )}
              />
            ))}
          </div>

          <p className="text-base leading-relaxed text-burgundy-800/90 italic font-medium">
            &quot;{testimonial.message}&quot;
          </p>

          {testimonial.products && !hasImage && (
            <div className="mt-4 inline-flex items-center text-sm font-semibold text-burgundy-600">
              <span className="mr-2 h-px w-8 bg-burgundy-200"></span>
              Review untuk {testimonial.products.name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
