import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatWhatsAppLink, formatPrice, WHATSAPP_NUMBER } from "@/lib/utils";
import type { ProductWithImages } from "@/lib/supabase/types";

interface ProductInfoProps {
  product: ProductWithImages;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const whatsappMessage = `Halo, saya tertarik dengan produk "${product.name}". Bisa minta info lebih lanjut?`;
  const whatsappLink = formatWhatsAppLink(WHATSAPP_NUMBER, whatsappMessage);

  return (
    <div className="space-y-6">
      <Link
        href="/galeri"
        className="inline-flex items-center gap-2 text-sm text-burgundy-600 transition-colors hover:text-burgundy-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Galeri
      </Link>

      {product.categories && (
        <Link
          href={`/galeri/${product.categories.slug}`}
          className="inline-block rounded-full bg-burgundy-100 px-3 py-1 text-sm font-medium text-burgundy-700 transition-colors hover:bg-burgundy-200"
        >
          {product.categories.name}
        </Link>
      )}

      <h1 className="text-3xl font-bold text-burgundy-900 md:text-4xl">
        {product.name}
      </h1>

      {product.price ? (
        <p className="text-xl font-medium text-burgundy-600">
          {formatPrice(product.price)}
        </p>
      ) : (
        <p className="text-sm italic text-burgundy-500">
          Harga bisa dibicarakan
        </p>
      )}

      <div className="flex items-center gap-2">
        <span
          className={`inline-flex h-3 w-3 rounded-full ${
            product.is_available ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <span
          className={`text-sm font-medium ${
            product.is_available ? "text-green-700" : "text-red-700"
          }`}
        >
          {product.is_available ? "Tersedia" : "Tidak Tersedia"}
        </span>
      </div>

      {product.description && (
        <div className="prose prose-burgundy">
          <p className="whitespace-pre-line text-lg leading-relaxed text-burgundy-700">
            {product.description}
          </p>
        </div>
      )}

      <div className="space-y-4 rounded-xl border border-burgundy-200 bg-cream-100 p-6">
        <p className="font-medium text-burgundy-800">
          Tertarik dengan produk ini?
        </p>
        <p className="text-sm text-burgundy-600">
          Hubungi kami via WhatsApp untuk pemesanan dan informasi harga.
        </p>
        <Button asChild variant="whatsapp" size="lg" className="w-full">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="h-5 w-5" />
            Pesan via WhatsApp
          </a>
        </Button>
      </div>

      <div className="space-y-3 text-sm text-burgundy-600">
        <p>✓ Dibuat dari bahan-bahan berkualitas</p>
        <p>✓ Fresh tanpa pengawet</p>
        <p>✓ Bisa request khusus</p>
        <p>✓ Pengiriman area Pekanbaru dan sekitarnya</p>
      </div>
    </div>
  );
}
