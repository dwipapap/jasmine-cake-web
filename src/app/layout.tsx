import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { Navbar, Footer, WhatsAppButton } from "@/components/layout";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
        className={`${playfairDisplay.variable} ${plusJakartaSans.variable} font-sans antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1 pb-24 sm:pb-0 sm:pt-24">{children}</main>
          <Footer />
        </div>
        <WhatsAppButton floating />
      </body>
    </html>
  );
}
