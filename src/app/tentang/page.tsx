import type { Metadata } from "next";
import { MessageCircle, MapPin, Phone, Clock, Heart, Sparkles, ChefHat, Palette, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatWhatsAppLink, WHATSAPP_NUMBER } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Tentang Jasmine Cake and Cookies - Usaha kue dan catering keluarga di Pekanbaru",
};

const FEATURES = [
  {
    icon: Heart,
    title: "Homemade dengan Cinta",
    description:
      "Setiap produk dibuat dengan resep keluarga yang telah teruji dan penuh kasih sayang.",
  },
  {
    icon: Sparkles,
    title: "Bahan Berkualitas",
    description:
      "Kami hanya menggunakan bahan-bahan segar dan berkualitas tinggi tanpa pengawet.",
  },
  {
    icon: ChefHat,
    title: "Fresh & Higienis",
    description:
      "Produk dibuat fresh sesuai pesanan dengan standar kebersihan yang tinggi.",
  },
  {
    icon: Palette,
    title: "Custom Sesuai Selera",
    description:
      "Bisa request khusus untuk rasa, ukuran, dan dekorasi sesuai kebutuhan Anda.",
  },
];

export default function TentangPage() {
  const whatsappLink = formatWhatsAppLink(
    WHATSAPP_NUMBER,
    "Halo, saya ingin bertanya tentang Jasmine Cake and Cookies"
  );

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-gradient-to-br from-burgundy-100/40 to-transparent opacity-60" />
        <div className="absolute -right-20 top-40 h-80 w-80 rounded-full bg-gradient-to-bl from-gold/10 to-transparent opacity-60" />
      </div>

      <div className="relative container mx-auto px-4 py-16 md:py-24">
        <section className="mb-20 text-center">
          <span className="mb-3 inline-block rounded-full bg-burgundy-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-burgundy-700">
            Tentang Kami
          </span>

          <h1 className="mb-6 font-serif text-4xl font-bold text-burgundy-900 md:text-5xl lg:text-6xl">
            Jasmine Cake and Cookies
          </h1>

          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-burgundy-700/80 md:text-xl">
            Jasmine Cake and Cookies adalah usaha rumahan yang menyediakan berbagai macam
            kue dan makanan homemade untuk berbagai acara. Berawal dari hobi
            memasak dan cinta terhadap kuliner, kami berkomitmen menyajikan
            produk berkualitas dengan cita rasa autentik.
          </p>
        </section>

        <section className="mb-20">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-serif text-3xl font-bold text-burgundy-900 md:text-4xl">
              Kenapa Memilih Kami?
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group relative overflow-hidden rounded-2xl border border-burgundy-100 bg-white/90 p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-burgundy-100/50"
                >
                  <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-burgundy-50 transition-colors duration-300 group-hover:bg-burgundy-100">
                    <Icon className="h-7 w-7 text-burgundy-700" />
                  </div>

                  <h3 className="mb-3 text-lg font-bold text-burgundy-900">
                    {feature.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-burgundy-700/80">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-20">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-3xl border border-burgundy-100 bg-white p-8 md:p-10 lg:p-12 shadow-sm">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-gradient-to-bl from-burgundy-50/50 to-transparent opacity-60" />

              <div className="relative">
                <h2 className="mb-6 font-serif text-3xl font-bold text-burgundy-900">
                  Cerita Kami
                </h2>

                <div className="space-y-6 text-lg text-burgundy-700/80">
                  <p className="leading-relaxed">
                    <span className="font-semibold text-burgundy-900">Jasmine Cake and Cookies</span> dimulai dari dapur kecil di rumah kami di
                    Pekanbaru. Berawal dari kebiasaan membuat kue untuk keluarga
                    dan teman-teman, kami mendapat banyak pujian dan permintaan
                    untuk membuat lebih banyak.
                  </p>
                  <p className="leading-relaxed">
                    Dengan semangat berbagi kebahagiaan melalui makanan, kami
                    memutuskan untuk membuka usaha kue dan catering keluarga.
                    Setiap produk yang kami buat adalah hasil dari resep yang
                    telah diwariskan turun-temurun dan terus kami sempurnakan.
                  </p>
                  <p className="leading-relaxed">
                    Kami percaya bahwa makanan yang dibuat dengan cinta akan
                    terasa berbeda. Itulah mengapa setiap pesanan kami tangani
                    dengan penuh perhatian dan dedikasi.
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-4 text-sm font-medium text-burgundy-800">
                  <div className="flex items-center gap-2 rounded-full bg-burgundy-50 px-4 py-2">
                    <div className="h-2 w-2 rounded-full bg-burgundy-500" />
                    <span>Resep Keluarga</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-burgundy-50 px-4 py-2">
                    <div className="h-2 w-2 rounded-full bg-burgundy-500" />
                    <span>Dibuat dengan Cinta</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-2xl border border-burgundy-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-burgundy-50">
                    <MapPin className="h-6 w-6 text-burgundy-700" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-bold text-burgundy-900">
                      Lokasi
                    </h3>
                    <p className="text-burgundy-700/80">
                      <span className="font-medium text-burgundy-900">Pekanbaru, Riau</span>
                      <br />
                      <span className="text-sm">
                        Pengiriman area Pekanbaru dan sekitarnya
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-burgundy-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-burgundy-50">
                    <Phone className="h-6 w-6 text-burgundy-700" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-bold text-burgundy-900">
                      Kontak
                    </h3>
                    <p className="text-burgundy-700/80">
                      <span className="font-medium text-burgundy-900">WhatsApp:</span> +62 852-7121-9119
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-burgundy-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-burgundy-50">
                    <Clock className="h-6 w-6 text-burgundy-700" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-bold text-burgundy-900">
                      Jam Operasional
                    </h3>
                    <p className="text-burgundy-700/80">
                      <span className="font-medium text-burgundy-900">Senin - Sabtu:</span> 08:00 - 17:00 WIB
                      <br />
                      <span className="text-sm">
                        Minggu: Tutup (Pesanan via WhatsApp)
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <Button
                asChild
                size="lg"
                className="group h-14 w-full rounded-full bg-burgundy-800 text-lg font-medium text-cream-50 shadow-xl shadow-burgundy-900/10 transition-all duration-300 hover:scale-[1.02] hover:bg-burgundy-900 hover:shadow-2xl"
              >
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Hubungi Kami
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-3xl bg-burgundy-800 p-8 text-center text-white shadow-xl md:p-12 lg:p-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-bl from-burgundy-600/30 to-transparent opacity-60" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-gradient-to-tr from-gold/10 to-transparent opacity-60" />

          <div className="relative">
            <h2 className="mb-4 font-serif text-2xl font-bold md:text-3xl lg:text-4xl">
              Siap Memesan?
            </h2>

            <p className="mx-auto mb-8 max-w-xl text-lg text-burgundy-100/80">
              Hubungi kami via WhatsApp untuk konsultasi menu, pemesanan, atau
              pertanyaan lainnya. Kami dengan senang hati akan membantu Anda!
            </p>

            <Button
              asChild
              size="lg"
              className="group h-14 rounded-full bg-white px-8 text-lg font-medium text-burgundy-800 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-cream-50 hover:shadow-2xl"
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <span className="relative z-10 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Chat via WhatsApp
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
