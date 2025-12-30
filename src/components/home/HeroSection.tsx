"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { ArrowRight, Wheat } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-cream-50 pt-20 pb-32">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] h-[70%] w-[70%] rounded-full bg-burgundy-100/30 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] h-[60%] w-[60%] rounded-full bg-gold/10 blur-[100px]" />
        <div className="absolute -bottom-[20%] left-[20%] h-[60%] w-[80%] rounded-full bg-cream-200/60 blur-[120px]" />
        
        <div 
          className="absolute inset-0 opacity-[0.4] mix-blend-overlay"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
          }} 
        />
      </div>

      <div className="absolute left-10 top-1/4 animate-float-slow opacity-5 hidden lg:block">
        <Wheat size={180} className="text-burgundy-900" />
      </div>
      <div className="absolute right-10 bottom-1/3 animate-float-slower opacity-5 hidden lg:block">
        <Wheat size={200} className="text-burgundy-900 rotate-45" />
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        <div className="mb-8 inline-flex animate-fade-in items-center gap-3 rounded-full border border-burgundy-200/40 bg-white/40 px-6 py-2 backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-burgundy-600" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-burgundy-800">
            Homemade dengan Cinta
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-burgundy-600" />
        </div>

        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <h1 className="font-serif text-5xl font-medium leading-tight text-burgundy-900 md:text-7xl lg:text-8xl">
            <span className="block drop-shadow-sm">Jasmine Cake</span>
            <span className="mt-2 block font-light italic text-burgundy-700/80 md:mt-4">
              & Cookies
            </span>
          </h1>
        </div>

        <p
          className="mx-auto mb-12 max-w-2xl text-lg font-light leading-relaxed text-burgundy-800/80 md:text-xl animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          Menghadirkan kehangatan rasa rumah dengan sentuhan elegan.
          <br className="hidden md:block" /> 
          Dibuat dari bahan premium untuk setiap momen spesial Anda.
        </p>

        <div
          className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          <Button
            size="lg"
            asChild
            className="group relative h-14 overflow-hidden rounded-full bg-burgundy-800 px-8 text-lg font-medium text-cream-50 shadow-xl shadow-burgundy-900/10 transition-all duration-300 hover:bg-burgundy-900 hover:scale-105 hover:shadow-2xl"
          >
            <Link href="/galeri">
              <span className="relative z-10 flex items-center gap-2">
                Lihat Menu Kami
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          </Button>
          <div className="rounded-full scale-100 transition-transform duration-300 hover:scale-105">
            <WhatsAppButton />
          </div>
        </div>
      </div>

      <div className="absolute -bottom-1 left-0 right-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block h-[80px] w-full md:h-[120px]"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            className="fill-white opacity-40"
          ></path>
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,2.92V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-cream-100"
          ></path>
        </svg>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translateY(0) rotate(45deg); }
          50% { transform: translateY(-30px) rotate(35deg); }
        }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
        .animate-fade-in-up { opacity: 0; animation: fade-in-up 1s ease-out forwards; }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-slower { animation: float-slower 10s ease-in-out infinite; }
      `}</style>
    </section>
  );
}
