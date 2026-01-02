import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatWhatsAppLink, WHATSAPP_NUMBER } from "@/lib/utils";

interface WhatsAppButtonProps {
  productName?: string;
  floating?: boolean;
}

export function WhatsAppButton({
  productName,
  floating = false,
}: WhatsAppButtonProps) {
  const message = productName
    ? `Halo, saya tertarik dengan produk *${productName}* dari Jasmine Cake and Cookies. Bisa info lebih lanjut?`
    : "Halo, saya tertarik dengan produk dari Jasmine Cake and Cookies. Bisa info lebih lanjut?";

  const whatsappUrl = formatWhatsAppLink(WHATSAPP_NUMBER, message);

  if (floating) {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 hover:shadow-xl md:bottom-6 md:right-6 md:h-14 md:w-14"
        aria-label="Hubungi via WhatsApp"
      >
        <MessageCircle className="h-6 w-6 md:h-7 md:w-7" />
      </a>
    );
  }

  return (
    <Button variant="whatsapp" size="lg" asChild className="rounded-full h-14 px-8 text-lg font-medium shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="h-5 w-5" />
        Pesan via WhatsApp
      </a>
    </Button>
  );
}
