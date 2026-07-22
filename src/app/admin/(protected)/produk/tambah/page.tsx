"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2, Upload, X } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createBrowserClient } from "@/lib/supabase/client";
import { createProduct, uploadProductImage } from "@/lib/actions";
import type { Product } from "@/lib/supabase/types";

const productSchema = z.object({
  name: z.string().min(1, "Nama produk harus diisi"),
  description: z.string().optional(),
  price: z.string().optional(),
  category_id: z.string().min(1, "Kategori harus dipilih"),
  is_available: z.boolean(),
});

type ProductForm = z.infer<typeof productSchema>;

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ImagePreview {
  file: File;
  previewUrl: string;
}

export default function AddProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      is_available: true,
    },
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        const supabase = createBrowserClient();
        const { data, error: fetchError } = await supabase
          .from("categories")
          .select("id, name, slug")
          .order("display_order");

        if (fetchError) {
          setCategoryError("Gagal memuat kategori. Silakan refresh halaman.");
          return;
        }

        if (data) {
          setCategories(data);
        }
      } catch {
        setCategoryError("Gagal memuat kategori. Silakan refresh halaman.");
      } finally {
        setIsLoadingCategories(false);
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    };
  }, [images]);

  const onSubmit = async (data: ProductForm) => {
    setError(null);
    setUploadErrors([]);

    startTransition(async () => {
      const priceValue = data.price ? parseInt(data.price.replace(/\D/g, ""), 10) : null;
      
      const result = await createProduct({
        name: data.name,
        description: data.description,
        price: priceValue,
        category_id: data.category_id,
        is_available: data.is_available,
      });

      if ("error" in result) {
        setError(result.error ?? "Gagal membuat produk");
        return;
      }

      const productData = result.data as Product | undefined;
      const productId = productData?.id;

      if (!productId) {
        setError("Gagal mendapatkan ID produk");
        return;
      }

      if (images.length > 0) {
        const failedUploads: string[] = [];
        
        for (let i = 0; i < images.length; i++) {
          const formData = new FormData();
          formData.append("productId", productId);
          formData.append("file", images[i].file);
          formData.append("isPrimary", i === 0 ? "true" : "false");

          const uploadResult = await uploadProductImage(formData);

          if ("error" in uploadResult) {
            failedUploads.push(`${images[i].file.name}: ${uploadResult.error}`);
          }
        }

        if (failedUploads.length > 0) {
          const successCount = images.length - failedUploads.length;
          const params = new URLSearchParams();
          params.set("created", "true");
          params.set("uploadWarning", `${successCount} foto berhasil, ${failedUploads.length} gagal diupload`);
          router.push(`/admin/produk?${params.toString()}`);
          return;
        }
      }

      router.push("/admin/produk");
    });
  };

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: ImagePreview[] = Array.from(files).map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      setImages((prev) => [...prev, ...newImages]);
    }
    e.target.value = "";
  }, []);

  const removeImage = useCallback((index: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/produk"
          className="rounded-lg p-2 text-burgundy-600 hover:bg-burgundy-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-burgundy-900">Tambah Produk</h1>
          <p className="mt-1 text-burgundy-600">Tambahkan produk baru</p>
        </div>
      </div>

      {error && (
        <Alert variant="error" title="Terjadi Kesalahan">
          {error}
        </Alert>
      )}

      {categoryError && (
        <Alert variant="error" title="Gagal Memuat Kategori">
          {categoryError}
        </Alert>
      )}

      {uploadErrors.length > 0 && (
        <Alert variant="error" title="Gagal Upload Foto">
          <p className="mb-2">Beberapa foto gagal diupload:</p>
          <ul className="list-inside list-disc text-sm opacity-90">
            {uploadErrors.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-4 sm:p-6">
          <h2 className="mb-4 text-lg font-semibold text-burgundy-900">
            Informasi Produk
          </h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Produk *</Label>
              <Input
                id="name"
                placeholder="Contoh: Nastar Keju Premium"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Harga (Rp)</Label>
              <Input
                id="price"
                type="text"
                inputMode="numeric"
                placeholder="Contoh: 150000 (kosongkan jika harga bisa dibicarakan)"
                {...register("price")}
              />
              <p className="text-xs text-burgundy-500">
                Kosongkan jika harga ingin dibicarakan via WhatsApp
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Kategori *</Label>
              {isLoadingCategories ? (
                <div className="flex items-center gap-2 text-sm text-burgundy-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memuat kategori...
                </div>
              ) : (
                <select
                  id="category"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                  {...register("category_id")}
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}
              {errors.category_id && (
                <p className="text-sm text-red-600">
                  {errors.category_id.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                placeholder="Deskripsi produk..."
                rows={4}
                {...register("description")}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_available"
                className="h-4 w-4 rounded border-border text-burgundy-600 focus:ring-burgundy-500"
                {...register("is_available")}
              />
              <Label htmlFor="is_available" className="font-normal">
                Produk tersedia
              </Label>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <h2 className="mb-4 text-lg font-semibold text-burgundy-900">
            Foto Produk
          </h2>
          <div className="space-y-4">
            <div className="rounded-lg border-2 border-dashed border-burgundy-200 p-6">
              <label className="flex cursor-pointer flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-burgundy-400" />
                <span className="text-sm text-burgundy-600">
                  Klik untuk upload foto
                </span>
                <span className="text-xs text-burgundy-400">
                  JPG, PNG, max 5MB
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 sm:gap-4 sm:grid-cols-4 md:grid-cols-6">
                {images.map((image, index) => (
                  <div key={index} className="group relative aspect-square">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.previewUrl}
                      alt={`Preview ${index + 1}`}
                      className="h-full w-full rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-0 opacity-100"
                    >
                      <X className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-1 left-1 rounded bg-burgundy-600 px-1 text-[10px] text-white">
                        Utama
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:gap-4">
          <Button type="button" variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/admin/produk">Batal</Link>
          </Button>
          <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Produk"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
