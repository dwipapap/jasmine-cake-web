import type { Metadata } from "next";
import { MessageCircle, Quote, ArrowRight } from "lucide-react";
import { TestimonialCard } from "@/components/testimonial";
import { Button } from "@/components/ui/button";
import { formatWhatsAppLink, WHATSAPP_NUMBER } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import type { Testimonial, Product } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Testimoni",
  description: "Testimoni dari pelanggan setia Jasmine Cake and Cookies",
};

type TestimonialWithProduct = Testimonial & {
  products: Product | null;
};

export default async function TestimoniPage() {
  const supabase = await createClient();

  const { data: testimonials } = await supabase
    .from("testimonials")
    .select(
      `
      *,
      products (*)
    `
    )
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  const typedTestimonials = (testimonials as TestimonialWithProduct[]) || [];

  const whatsappLink = formatWhatsAppLink(
    WHATSAPP_NUMBER,
    "Halo, saya ingin memesan produk dari Jasmine Cake and Cookies"
  );

  const featuredTestimonials = typedTestimonials.filter((t) => t.is_featured);
  const regularTestimonials = typedTestimonials.filter((t) => !t.is_featured);

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-gradient-to-br from-burgundy-100/40 to-transparent opacity-60" />
        <div className="absolute -right-20 top-40 h-80 w-80 rounded-full bg-gradient-to-bl from-gold/10 to-transparent opacity-60" />
      </div>

      <div className="relative container mx-auto px-4 pb-24 pt-16">
        <section className="mb-16 text-center">
          <span className="mb-3 inline-block rounded-full bg-burgundy-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-burgundy-700">
            Testimoni Pelanggan
          </span>

          <h1 className="mb-6 font-serif text-4xl font-bold text-burgundy-900 md:text-5xl lg:text-6xl">
            Apa Kata Mereka?
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-burgundy-700/80">
            Testimoni dari pelanggan setia yang sudah mempercayakan kebutuhan
            kue dan makanan mereka kepada Jasmine Cake and Cookies.
          </p>
        </section>

        {featuredTestimonials.length > 0 && (
          <section className="mb-16">
            <h2 className="mb-8 font-serif text-2xl font-bold text-burgundy-900 md:text-3xl">
              Testimoni Pilihan
            </h2>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {featuredTestimonials.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                  featured
                />
              ))}
            </div>
          </section>
        )}

        {regularTestimonials.length > 0 && (
          <section className="mb-16">
            <h2 className="mb-8 font-serif text-2xl font-bold text-burgundy-900 md:text-3xl">
              Testimoni Lainnya
            </h2>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {regularTestimonials.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                />
              ))}
            </div>
          </section>
        )}

        {typedTestimonials.length === 0 && (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-burgundy-200 bg-white/50 p-12 text-center shadow-sm">
            <div className="mb-6 rounded-full bg-burgundy-50 p-6">
              <Quote className="h-12 w-12 text-burgundy-300" />
            </div>
            <h3 className="mb-2 font-serif text-xl font-bold text-burgundy-800">
              Belum Ada Testimoni
            </h3>
            <p className="mb-8 max-w-md text-burgundy-600">
              Jadilah yang pertama merasakan kelezatan produk kami dan berikan testimoni Anda!
            </p>
            <Button
              asChild
              size="lg"
              className="group h-14 rounded-full bg-burgundy-800 px-8 text-lg font-medium text-cream-50 shadow-xl shadow-burgundy-900/10 transition-all duration-300 hover:scale-105 hover:bg-burgundy-900 hover:shadow-2xl"
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" />
                Pesan Sekarang
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </Button>
          </div>
        )}

        <section className="relative overflow-hidden rounded-3xl bg-burgundy-800 p-8 text-center text-white shadow-xl md:p-12 lg:p-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-bl from-burgundy-600/30 to-transparent opacity-60" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-gradient-to-tr from-gold/10 to-transparent opacity-60" />

          <div className="relative">
            <h2 className="mb-4 font-serif text-2xl font-bold md:text-3xl lg:text-4xl">
              Ingin Menjadi Bagian dari Cerita Kami?
            </h2>

            <p className="mx-auto mb-8 max-w-xl text-lg text-burgundy-100/80">
              Pesan sekarang dan rasakan sendiri kelezatan produk homemade dari
              Jasmine Cake and Cookies!
            </p>

            <Button
              asChild
              size="lg"
              className="group h-14 rounded-full bg-white px-8 text-lg font-medium text-burgundy-800 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-cream-50 hover:shadow-2xl"
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <span className="relative z-10 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Pesan Sekarang
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </a>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
