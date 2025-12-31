import type { Metadata } from "next";
import { MessageCircle, MapPin, Phone, Clock, Heart, Sparkles, ChefHat, Palette, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatWhatsAppLink, WHATSAPP_NUMBER } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Cerita dapur Jasmine Cake and Cookies - Menghadirkan kehangatan kue rumahan di Pekanbaru sejak awal.",
};

const FEATURES = [
  {
    icon: Heart,
    title: "Homemade dengan Cinta",
    description:
      "Setiap adonan diaduk dengan ketulusan, menggunakan resep keluarga yang menjaga keaslian rasa sejak suapan pertama.",
  },
  {
    icon: Sparkles,
    title: "Bahan Premium",
    description:
      "Kami tidak berkompromi soal kualitas. Hanya bahan segar, mentega pilihan, dan tanpa pengawet buatan.",
  },
  {
    icon: ChefHat,
    title: "Selalu Fresh",
    description:
      "Dipanggang khusus saat Anda memesan. Menjamin aroma dan tekstur terbaik saat sampai di tangan Anda.",
  },
  {
    icon: Palette,
    title: "Sentuhan Personal",
    description:
      "Punya ide khusus? Kami siap mewujudkan kue impian Anda dengan dekorasi dan rasa sesuai selera.",
  },
];

export default function TentangPage() {
  const whatsappLink = formatWhatsAppLink(
    WHATSAPP_NUMBER,
    "Halo, saya ingin bertanya lebih lanjut tentang Jasmine Cake and Cookies"
  );

  return (
    <div className="min-h-screen bg-cream-50 selection:bg-burgundy-100 selection:text-burgundy-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-burgundy-100/30 blur-3xl" />
        <div className="absolute -right-20 top-1/3 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute left-1/2 top-2/3 -translate-x-1/2 h-64 w-64 rounded-full bg-burgundy-50/50 blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-12 md:py-20 lg:py-24">
        <section className="mb-20 text-center md:mb-32">
          <div className="animate-fade-in-up">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-burgundy-100 bg-white/50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-burgundy-600 backdrop-blur-sm shadow-sm">
              <Star className="h-3 w-3 fill-burgundy-600 text-burgundy-600" />
              Cerita Dapur Kami
            </span>

            <h1 className="mb-6 font-serif text-4xl font-bold leading-tight text-burgundy-900 md:text-6xl lg:text-7xl">
              Lebih dari Sekadar <br className="hidden md:block" />
              <span className="italic text-burgundy-600">Kue Rumahan</span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-burgundy-800/70 md:text-xl">
              Di Jasmine Cake and Cookies, kami percaya bahwa setiap kue menyimpan cerita. 
              Cerita tentang kehangatan keluarga, tradisi yang dijaga, dan kebahagiaan yang dibagi dalam setiap potongnya.
            </p>
          </div>
        </section>

        <section className="mb-24 md:mb-32">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group relative overflow-hidden rounded-3xl bg-white p-5 shadow-sm ring-1 ring-burgundy-100/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-burgundy-900/5 sm:p-8"
                >
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-cream-100 text-burgundy-700 transition-colors duration-500 group-hover:bg-burgundy-600 group-hover:text-cream-50 sm:mb-6 sm:h-14 sm:w-14">
                    <Icon className="h-5 w-5 sm:h-7 sm:w-7" />
                  </div>

                  <h3 className="mb-2 font-serif text-base font-bold text-burgundy-900 sm:mb-3 sm:text-xl">
                    {feature.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-burgundy-700/70 sm:text-base">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-24 md:mb-32">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7 xl:col-span-8">
              <div className="relative h-full overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-burgundy-50 sm:rounded-[2.5rem] sm:p-8 md:p-12 lg:p-16">
                <Quote className="absolute right-4 top-4 h-16 w-16 rotate-180 fill-burgundy-50 text-burgundy-50 opacity-50 sm:right-8 sm:top-8 sm:h-24 sm:w-24" />

                <h2 className="relative mb-5 font-serif text-2xl font-bold text-burgundy-900 sm:mb-8 sm:text-3xl md:text-4xl">
                  Bermula dari Hobi, <br />
                  <span className="text-burgundy-600 italic">Tumbuh dengan Hati</span>
                </h2>

                <div className="relative space-y-4 text-base leading-relaxed text-burgundy-800/80 sm:space-y-6 sm:text-lg">
                  <p>
                    <strong className="font-semibold text-burgundy-900">Jasmine Cake and Cookies</strong> bukan sekadar bisnis bagi kami. 
                    Ini adalah perpanjangan dari dapur keluarga kami di Pekanbaru, tempat di mana aroma mentega dan panggangan hangat selalu menyambut siapa saja yang datang.
                  </p>
                  <p>
                    Awalnya hanya sekadar hobi menyajikan camilan untuk keluarga dan kerabat terdekat. Namun, senyuman dan pujian mereka menjadi semangat bagi kami untuk melangkah lebih jauh. 
                    Kami ingin lebih banyak orang merasakan kenikmatan resep warisan yang kami jaga keasliannya.
                  </p>
                  <blockquote className="my-6 border-l-4 border-burgundy-200 bg-cream-50/50 p-4 italic text-burgundy-700 sm:my-8 sm:p-6">
                    &ldquo;Kami tidak hanya menjual kue, kami mengirimkan sepotong kebahagiaan dari dapur kami ke meja makan Anda.&rdquo;
                  </blockquote>
                  <p>
                    Setiap pesanan Anda kami kerjakan dengan tangan kami sendiri, memastikan standar kebersihan tertinggi dan detail yang sempurna. Karena bagi kami, Anda bukan sekadar pelanggan, tapi bagian dari keluarga besar penikmat rasa Jasmine.
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-2 sm:mt-10 sm:gap-3">
                  {['Resep Warisan', '100% Halal', 'Tanpa Pengawet', 'Bahan Premium'].map((tag) => (
                    <span key={tag} className="rounded-full bg-burgundy-50 px-3 py-1.5 text-xs font-medium text-burgundy-700 sm:px-4 sm:py-2 sm:text-sm">
                      # {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6 lg:col-span-5 xl:col-span-4">
              <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-burgundy-50 transition-transform hover:scale-[1.02]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-burgundy-100 text-burgundy-700">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-serif text-xl font-bold text-burgundy-900">Lokasi Dapur</h3>
                <p className="text-burgundy-700/80">
                  Pekanbaru, Riau<br />
                  <span className="text-sm text-burgundy-500 mt-1 block">Melayani pengiriman area dalam kota & sekitarnya</span>
                </p>
              </div>

              <div className="rounded-[2rem] bg-burgundy-900 p-8 text-cream-50 shadow-lg shadow-burgundy-900/10 transition-transform hover:scale-[1.02]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-cream-50">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="mb-4 font-serif text-xl font-bold text-white">Jam Operasional</h3>
                <div className="space-y-3 text-cream-100/90">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span>Senin - Sabtu</span>
                    <span className="font-semibold">08:00 - 17:00</span>
                  </div>
                  <div className="flex justify-between opacity-80">
                    <span>Minggu</span>
                    <span>Tutup (Pre-order Only)</span>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] bg-gradient-to-br from-cream-100 to-white p-8 shadow-sm ring-1 ring-burgundy-50 transition-transform hover:scale-[1.02]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-burgundy-100 text-burgundy-700">
                  <Phone className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-serif text-xl font-bold text-burgundy-900">Kontak Langsung</h3>
                <p className="mb-6 text-burgundy-700/80">
                  Konsultasi pesanan atau tanya harga? Chat kami langsung.
                </p>
                <Button
                  asChild
                  className="w-full rounded-xl bg-burgundy-600 text-white hover:bg-burgundy-700 shadow-md shadow-burgundy-900/5"
                >
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Chat WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[2.5rem] bg-burgundy-900 px-6 py-16 text-center text-white shadow-2xl shadow-burgundy-900/20 sm:px-12 md:py-24">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-burgundy-800 opacity-50 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-96 w-96 rounded-full bg-burgundy-950 opacity-50 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-3xl">
            <h2 className="mb-6 font-serif text-3xl font-bold leading-tight md:text-5xl">
              Siap Mencicipi Kelezatannya?
            </h2>
            <p className="mb-10 text-lg text-burgundy-100/90 md:text-xl">
              Jangan ragu untuk berdiskusi mengenai kue impian Anda. Kami siap membantu mewujudkan momen spesial Anda menjadi lebih manis.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-14 w-full rounded-full bg-cream-50 text-lg font-bold text-burgundy-900 hover:bg-white hover:text-burgundy-950 sm:w-auto px-8 shadow-xl"
              >
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Pesan Sekarang
                </a>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
