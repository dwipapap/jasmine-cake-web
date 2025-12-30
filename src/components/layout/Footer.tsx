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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid gap-12 md:grid-cols-3 lg:gap-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cream-50 to-cream-100 shadow-xl">
                <span className="text-lg font-bold text-burgundy-800 tracking-wide">JC</span>
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-burgundy-600/20"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-cream-50 tracking-tight">
                  Jasmine Cake
                </span>
                <span className="text-xs font-medium text-cream-200/80 tracking-wide uppercase">
                  and Cookies
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-cream-200/90 font-light">
              Kue & makanan homemade dengan cinta untuk momen spesial Anda.
              Dibuat dengan bahan berkualitas dan resep keluarga turun temurun.
            </p>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-semibold text-cream-50 tracking-wide uppercase opacity-90">
              Navigasi
            </h4>
            <nav className="flex flex-col space-y-3">
              {[
                { href: "/", label: "Beranda" },
                { href: "/galeri", label: "Galeri" },
                { href: "/testimoni", label: "Testimoni" },
                { href: "/tentang", label: "Tentang Kami" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative inline-block text-sm text-cream-200/90 transition-all duration-200 hover:text-cream-50 hover:pl-2"
                >
                  <span className="relative z-10">{link.label}</span>
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-0 w-0.5 bg-cream-100 transition-all duration-200 group-hover:h-full opacity-0 group-hover:opacity-100"></span>
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-semibold text-cream-50 tracking-wide uppercase opacity-90">
              Hubungi Kami
            </h4>
            <div className="flex flex-col space-y-4">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-sm text-cream-200/90 transition-all duration-200 hover:text-cream-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-burgundy-700/50 transition-all duration-200 group-hover:bg-burgundy-600/70 group-hover:scale-110">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="font-medium">+62 852-7121-9119</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-sm text-cream-200/90 transition-all duration-200 hover:text-cream-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-burgundy-700/50 transition-all duration-200 group-hover:bg-burgundy-600/70 group-hover:scale-110">
                  <Instagram className="h-4 w-4" />
                </div>
                <span className="font-medium">@jasminecakecookies</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-burgundy-700/50 pt-8">
          <p className="text-center text-xs font-light text-cream-200/70 tracking-wide">
            &copy; {new Date().getFullYear()} Jasmine Cake and Cookies. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
