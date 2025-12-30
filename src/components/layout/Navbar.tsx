"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/galeri", label: "Galeri" },
  { href: "/testimoni", label: "Testimoni" },
  { href: "/tentang", label: "Tentang" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cream-200/50 bg-cream-50/95 shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-burgundy-700 to-burgundy-800 shadow-lg shadow-burgundy-900/10 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-burgundy-900/20 group-hover:-translate-y-0.5">
            <span className="text-lg font-bold text-cream-50 tracking-wide">JC</span>
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-burgundy-400/20"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-burgundy-900 tracking-tight transition-colors group-hover:text-burgundy-700">
              Jasmine Cake
            </span>
            <span className="text-xs font-medium text-burgundy-600/80 tracking-wide uppercase">
              and Cookies
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-1">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative px-5 py-2.5 text-sm font-medium text-burgundy-700 transition-all duration-200 hover:text-burgundy-900 rounded-lg hover:bg-burgundy-100/50"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-10 w-10 text-burgundy-700 hover:bg-burgundy-100/50"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-cream-200/50 bg-cream-50/95 md:hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="flex flex-col space-y-1 p-4 sm:p-6">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl px-5 py-3.5 text-sm font-medium text-burgundy-700 transition-all duration-200 hover:bg-burgundy-100/70 hover:text-burgundy-900 hover:pl-6"
              onClick={() => setIsOpen(false)}
              style={{
                animationDelay: `${index * 60}ms`,
                animation: isOpen ? 'slideIn 0.3s ease-out forwards' : 'none'
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </header>
  );
}
