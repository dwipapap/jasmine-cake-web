import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export function formatPrice(price: number): string {
  return `Rp ${price.toLocaleString("id-ID")}`;
}

export const WHATSAPP_NUMBER = "6285271219119";

export const CATEGORIES = [
  { name: "Kue Kering", slug: "kue-kering" },
  { name: "Kue Basah", slug: "kue-basah" },
  { name: "Nasi Kotak", slug: "nasi-kotak" },
  { name: "Snack Box", slug: "snack-box" },
  { name: "Tumpeng", slug: "tumpeng" },
] as const;
