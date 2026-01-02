import Link from "next/link";
import { Phone, Instagram } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="relative border-t border-cream-200/30 bg-gradient-to-br from-burgundy-900 via-burgundy-800 to-burgundy-900 text-cream-100 overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(254, 246, 235, 0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 relative">
        <div className="flex items-center justify-between">
          <Link href="/" className="group">
            <div className="flex flex-col">
              <span className="text-lg md:text-2xl font-serif font-bold text-cream-50 tracking-wide transition-colors group-hover:text-cream-200">
                Jasmine Cake
              </span>
              <span className="text-[8px] md:text-[10px] font-medium text-cream-200/80 tracking-[0.2em] uppercase">
                and Cookies
              </span>
            </div>
          </Link>

          <div className="flex flex-col items-end">
            <h4 className="mb-2 text-[10px] md:text-xs font-semibold text-cream-50 tracking-wide uppercase opacity-90">
              Hubungi Kami
            </h4>
            <div className="flex flex-col space-y-1.5 items-end">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-xs text-cream-200/90 transition-all duration-200 hover:text-cream-50"
              >
                <div className="flex h-6 w-6 md:h-8 md:w-8 items-center justify-center rounded-lg bg-burgundy-700/50 transition-all duration-200 group-hover:bg-burgundy-600/70">
                  <Phone className="h-3 w-3 md:h-4 md:w-4" />
                </div>
                <span className="font-medium text-[11px] md:text-sm">+62 852-7121-9119</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-xs text-cream-200/90 transition-all duration-200 hover:text-cream-50"
              >
                <div className="flex h-6 w-6 md:h-8 md:w-8 items-center justify-center rounded-lg bg-burgundy-700/50 transition-all duration-200 group-hover:bg-burgundy-600/70">
                  <Instagram className="h-3 w-3 md:h-4 md:w-4" />
                </div>
                <span className="font-medium text-[11px] md:text-sm">@jasminecakecookies</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-4 border-t border-burgundy-700/50 pt-4">
          <p className="text-center text-[10px] md:text-xs font-light text-cream-200/70 tracking-wide">
            &copy; {new Date().getFullYear()} Jasmine Cake and Cookies. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
