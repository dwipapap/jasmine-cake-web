"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import type { Popup } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

interface PopupBannerProps {
  popup: Popup;
}

export function PopupBanner({ popup }: PopupBannerProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let animTimer: NodeJS.Timeout;
    const timer = setTimeout(() => {
      setIsVisible(true);
      // Small delay to ensure render happens before animation starts
      animTimer = setTimeout(() => setIsAnimating(true), 50);
    }, 1500);

    return () => {
      clearTimeout(timer);
      clearTimeout(animTimer);
    };
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  if (!isOpen || !isVisible || !popup.image_url) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 transition-all duration-300 ease-out",
        isAnimating ? "opacity-100" : "opacity-0"
      )}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Popup banner"
      data-popup-overlay="true"
    >
      <div
        className={cn(
          "relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-xl shadow-2xl transition-all duration-300 ease-out",
          isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80 backdrop-blur-sm"
          aria-label="Tutup popup"
        >
          <X className="h-5 w-5" />
        </button>

        {popup.link_url ? (
          <a
            href={popup.link_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="block w-full h-full"
          >
            <div className="relative aspect-square w-full sm:aspect-video bg-gray-100">
              <Image
                src={popup.image_url}
                alt="Promo popup"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 672px"
              />
            </div>
          </a>
        ) : (
          <div className="relative aspect-square w-full sm:aspect-video bg-gray-100">
            <Image
              src={popup.image_url}
              alt="Promo popup"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </div>
        )}
      </div>
    </div>
  );
}
