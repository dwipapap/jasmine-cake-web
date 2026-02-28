"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import type { Popup } from "@/lib/supabase/types";

interface PopupBannerProps {
  popup: Popup;
}

export function PopupBanner({ popup }: PopupBannerProps) {
  const [isOpen, setIsOpen] = useState(true);


  if (!isOpen || !popup.image_url) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 transition-opacity duration-300 animate-in fade-in"
      onClick={() => setIsOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Popup banner"
      data-popup-overlay="true"
    >
      <div
        className="relative max-h-[90vh] w-full max-w-lg overflow-hidden rounded-xl shadow-2xl transition-transform duration-300 animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsOpen(false)}
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
                sizes="(max-width: 768px) 100vw, 512px"
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
              sizes="(max-width: 768px) 100vw, 512px"
            />
          </div>
        )}
      </div>
    </div>
  );
}
