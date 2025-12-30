"use client";

import { useState, useTransition, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle, ArrowLeft, Send, Sparkles, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { createTestimonial, uploadTestimonialImage } from "@/lib/actions";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const testimonialSchema = z.object({
  customer_name: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  message: z
    .string()
    .min(10, "Testimoni minimal 10 karakter")
    .max(500, "Testimoni maksimal 500 karakter"),
});

type TestimonialFormData = z.infer<typeof testimonialSchema>;

export default function TambahTestimoniPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema),
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError(null);

    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setImageError("Format file harus JPEG, PNG, atau WebP");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setImageError("Ukuran file maksimal 5MB");
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setImageError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = (data: TestimonialFormData) => {
    setError(null);
    startTransition(async () => {
      let imageUrl: string | undefined;

      if (selectedImage) {
        const uploadResult = await uploadTestimonialImage(selectedImage);
        if (uploadResult.error) {
          setError(`Gagal upload gambar: ${uploadResult.error}`);
          return;
        }
        imageUrl = uploadResult.url;
      }

      const result = await createTestimonial({
        customer_name: data.customer_name,
        message: data.message,
        image_url: imageUrl,
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      setIsSuccess(true);
      reset();
      removeImage();
    });
  };

  return (
    <div className="min-h-screen bg-cream-50 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-gradient-to-br from-burgundy-100/40 to-transparent opacity-60 animate-pulse delay-700" />
        <div className="absolute -right-20 top-40 h-80 w-80 rounded-full bg-gradient-to-bl from-gold/10 to-transparent opacity-60 animate-pulse" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-gradient-to-t from-cream-100/50 to-transparent opacity-60 -z-10" />
      </div>

      <div className="container relative mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-lg">
          <Link
            href="/testimoni"
            className="group mb-8 inline-flex items-center gap-2 rounded-full bg-white/50 px-4 py-2 text-sm font-medium text-burgundy-700 shadow-sm transition-all hover:bg-white hover:text-burgundy-900 hover:shadow-md"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Kembali ke Testimoni
          </Link>

          {isSuccess ? (
            <Card className="animate-in fade-in zoom-in-95 duration-500 mx-auto border-none bg-white/90 p-8 text-center shadow-2xl">
              <div className="mb-6 flex justify-center">
                <div className="relative rounded-full bg-green-100/50 p-4 ring-8 ring-green-50">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                  <div className="absolute -right-1 -top-1 animate-bounce">
                    <Sparkles className="h-6 w-6 text-gold fill-gold" />
                  </div>
                </div>
              </div>
              <h1 className="mb-3 font-serif text-3xl font-bold text-burgundy-900">
                Terima Kasih!
              </h1>
              <p className="mb-8 text-lg text-burgundy-700/80 leading-relaxed">
                Testimoni Anda telah berhasil dikirim. Kami sangat menghargai
                masukan berharga dari Anda untuk kemajuan kami!
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button
                  asChild
                  className="h-12 rounded-full bg-burgundy-800 px-8 text-base font-medium text-cream-50 shadow-lg shadow-burgundy-900/20 transition-all hover:scale-105 hover:bg-burgundy-900 hover:shadow-xl"
                >
                  <Link href="/testimoni">Lihat Testimoni Lainnya</Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsSuccess(false);
                    reset();
                  }}
                  className="h-12 rounded-full border-burgundy-200 px-8 text-base font-medium text-burgundy-700 hover:bg-burgundy-50 hover:text-burgundy-900"
                >
                  Kirim Testimoni Lagi
                </Button>
              </div>
            </Card>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="mb-8 text-center">
                <span className="mb-4 inline-block rounded-full bg-burgundy-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-burgundy-700 shadow-sm">
                  Formulir Testimoni
                </span>
                <h1 className="mb-4 font-serif text-3xl font-bold text-burgundy-900 md:text-4xl lg:text-5xl">
                  Bagikan Cerita Anda
                </h1>
                <p className="mx-auto max-w-md text-lg text-burgundy-700/80">
                  Pengalaman Anda adalah inspirasi kami. Ceritakan momen manis Anda bersama Jasmine Cake.
                </p>
              </div>

              <Card className="border-none bg-white/90 p-6 shadow-2xl md:p-10">
                <form onSubmit={(e) => {
                  handleSubmit(onSubmit)(e);
                }} className="space-y-6">
                  {error && (
                    <div className="animate-in slide-in-from-top-2 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100">
                      <div className="h-2 w-2 rounded-full bg-red-600" />
                      {error}
                    </div>
                  )}

                  <div className="space-y-2.5">
                    <Label htmlFor="customer_name" className="text-base font-semibold text-burgundy-900">
                      Nama Anda
                    </Label>
                    <Input
                      id="customer_name"
                      placeholder="Contoh: Budi Santoso"
                      {...register("customer_name")}
                      className="h-12 rounded-xl border-burgundy-100 bg-cream-50/50 px-4 text-burgundy-900 placeholder:text-burgundy-300 focus:border-burgundy-400 focus:bg-white focus:ring-4 focus:ring-burgundy-400/10 transition-all"
                    />
                    {errors.customer_name && (
                      <p className="text-sm font-medium text-red-600 animate-in slide-in-from-left-2">
                        {errors.customer_name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="message" className="text-base font-semibold text-burgundy-900">
                      Testimoni Anda
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Ceritakan pengalaman Anda di sini..."
                      rows={5}
                      {...register("message")}
                      className="resize-none rounded-xl border-burgundy-100 bg-cream-50/50 p-4 text-burgundy-900 placeholder:text-burgundy-300 focus:border-burgundy-400 focus:bg-white focus:ring-4 focus:ring-burgundy-400/10 transition-all"
                    />
                    {errors.message && (
                      <p className="text-sm font-medium text-red-600 animate-in slide-in-from-left-2">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    <Label className="text-base font-semibold text-burgundy-900">
                      Foto (Opsional)
                    </Label>
                    {imagePreview ? (
                      <div className="group relative overflow-hidden rounded-2xl border border-burgundy-200 bg-white shadow-lg shadow-burgundy-100/50 transition-all hover:shadow-burgundy-200/50 animate-in fade-in zoom-in-95 duration-500">
                        <div className="relative aspect-video w-full overflow-hidden bg-burgundy-50">
                          <Image
                            src={imagePreview}
                            alt="Preview Foto"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-burgundy-900/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                          
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-burgundy-900 shadow-sm transition-all hover:bg-red-50 hover:text-red-600 hover:shadow-md hover:scale-110"
                            title="Hapus foto"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-3 border-t border-burgundy-100 bg-cream-50/50 p-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 ring-4 ring-green-50">
                            <CheckCircle className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-burgundy-900">
                              {selectedImage?.name || "Foto berhasil dipilih"}
                            </p>
                            <p className="text-xs text-burgundy-500">
                              {(selectedImage?.size ? (selectedImage.size / 1024 / 1024).toFixed(2) : "0")} MB
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => fileInputRef.current?.click()}
                            className="h-9 rounded-full px-4 text-xs font-medium text-burgundy-600 hover:bg-burgundy-100 hover:text-burgundy-900"
                          >
                            Ganti
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="group relative flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-burgundy-200/60 bg-gradient-to-b from-cream-50/50 to-white/50 px-6 py-12 text-center transition-all duration-300 hover:border-burgundy-400 hover:bg-burgundy-50/30 hover:shadow-lg hover:shadow-burgundy-100/20"
                      >
                        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-md shadow-burgundy-100/50 ring-1 ring-burgundy-100 transition-all duration-300 group-hover:scale-110 group-hover:ring-burgundy-200">
                          <div className="absolute inset-0 rounded-full bg-burgundy-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                          <ImagePlus className="relative h-10 w-10 text-burgundy-300 transition-colors duration-300 group-hover:text-burgundy-600" />
                          <div className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-gold text-white shadow-sm ring-2 ring-white transition-transform duration-500 group-hover:rotate-90">
                            <span className="text-lg font-bold leading-none">+</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-lg font-bold text-burgundy-900 transition-colors group-hover:text-burgundy-700">
                            Klik untuk upload foto
                          </p>
                          <p className="text-sm text-burgundy-500">
                            atau seret file ke area ini
                          </p>
                        </div>
                        <div className="rounded-full bg-burgundy-50 px-4 py-1.5">
                          <p className="text-xs font-medium text-burgundy-600">
                            JPEG, PNG, WebP (Maks. 5MB)
                          </p>
                        </div>
                      </div>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageSelect}
                      className="hidden"
                    />

                    {imageError && (
                      <p className="text-sm font-medium text-red-600 animate-in slide-in-from-left-2">
                        {imageError}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="group h-14 w-full rounded-full bg-burgundy-800 text-lg font-medium text-cream-50 shadow-xl shadow-burgundy-900/10 transition-all duration-300 hover:scale-[1.02] hover:bg-burgundy-900 hover:shadow-2xl disabled:opacity-70"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                        Kirim Testimoni
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
