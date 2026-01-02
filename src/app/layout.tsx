import type { Metadata } from "next";
import { Unna } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Navbar, Footer, WhatsAppButton } from "@/components/layout";
import "./globals.css";

const unna = Unna({
  variable: "--font-unna",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Jasmine Cake and Cookies - Kue & Makanan Homemade",
    template: "%s | Jasmine Cake and Cookies",
  },
  description:
    "Kue & makanan homemade dengan cinta untuk momen spesial Anda. Kue kering, kue basah, nasi kotak, snack box, dan tumpeng.",
  keywords: [
    "kue",
    "cake",
    "homemade",
    "kue kering",
    "kue basah",
    "nasi kotak",
    "snack box",
    "tumpeng",
    "catering",
  ],
  authors: [{ name: "Jasmine Cake and Cookies" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Jasmine Cake and Cookies",
    title: "Jasmine Cake and Cookies - Kue & Makanan Homemade",
    description:
      "Kue & makanan homemade dengan cinta untuk momen spesial Anda.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${unna.variable} font-sans antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1 pb-20 md:pb-0">{children}</main>
          <Footer />
        </div>
        <WhatsAppButton floating />
        <Analytics />
      </body>
    </html>
  );
}
