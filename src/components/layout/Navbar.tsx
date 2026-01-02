"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Images, MessageSquareQuote, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const leftNavLinks = [
  { href: "/", label: "Beranda" },
  { href: "/galeri", label: "Galeri" },
];

const rightNavLinks = [
  { href: "/testimoni", label: "Testimoni" },
  { href: "/tentang", label: "Tentang" },
];

const mobileNavLinks = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/galeri", label: "Galeri", icon: Images },
  { href: "/testimoni", label: "Testimoni", icon: MessageSquareQuote },
  { href: "/tentang", label: "Tentang", icon: Info },
];

export function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-cream-200/50 bg-cream-50 md:bg-cream-50/95 md:backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-center px-4 sm:px-6 lg:px-8">
          <nav className="hidden md:flex md:items-center md:gap-8 flex-1">
            {leftNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-burgundy-700 transition-colors duration-200 hover:text-burgundy-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link href="/" className="group flex-shrink-0 md:px-8">
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-serif font-bold text-burgundy-800 tracking-wide transition-colors group-hover:text-burgundy-600">
                Jasmine Cake
              </span>
              <span className="text-[10px] md:text-xs font-medium text-burgundy-500 tracking-[0.2em] uppercase">
                and Cookies
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex md:items-center md:justify-end md:gap-8 flex-1">
            {rightNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-burgundy-700 transition-colors duration-200 hover:text-burgundy-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-cream-200 bg-cream-50 md:hidden">
        <div className="flex h-16 items-center justify-around px-2">
          {mobileNavLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center justify-center gap-1 px-3 py-2"
              >
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full px-4 py-1.5 transition-all duration-200",
                    active
                      ? "bg-burgundy-100 text-burgundy-700"
                      : "text-burgundy-400"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium transition-colors duration-200",
                    active ? "text-burgundy-700" : "text-burgundy-400"
                  )}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
