"use client";

import { useState, useEffect, use, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2, Upload, X, Trash2 } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createBrowserClient } from "@/lib/supabase/client";
import { updateProduct, uploadProductImage, deleteProductImage } from "@/lib/actions";

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

interface ProductImage {
  id: string;
  image_url: string;
  is_primary: boolean;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  category_id: string;
  is_available: boolean;
  product_images: ProductImage[];
}

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    async function fetchData() {
      const supabase = createBrowserClient();

      const [productResult, categoriesResult] = await Promise.all([
        supabase
          .from("products")
          .select(`
            id,
            name,
            description,
            price,
            category_id,
            is_available,
            product_images(id, image_url, is_primary)
          `)
          .eq("id", id)
          .single(),
        supabase
          .from("categories")
          .select("id, name, slug")
          .order("display_order"),
      ]);

      const productData = productResult.data as Product | null;
      if (productData) {
        setProduct(productData);
        setExistingImages(productData.product_images || []);
        reset({
          name: productData.name,
          description: productData.description || "",
          price: productData.price ? productData.price.toString() : "",
          category_id: productData.category_id,
          is_available: productData.is_available,
        });
      }

      const categoriesData = categoriesResult.data as Category[] | null;
      if (categoriesData) {
        setCategories(categoriesData);
      }

      setIsLoading(false);
    }

    fetchData();
  }, [id, reset]);

  const onSubmit = async (data: ProductForm) => {
    setError(null);

    startTransition(async () => {
      const priceValue = data.price ? parseInt(data.price.replace(/\D/g, ""), 10) : null;
      
      const result = await updateProduct(id, {
        name: data.name,
        description: data.description,
        price: priceValue,
        category_id: data.category_id,
        is_available: data.is_available,
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      if (newImages.length > 0) {
        const hasPrimary = existingImages.some((img) => img.is_primary);
        const failedUploads: string[] = [];
        
        for (let i = 0; i < newImages.length; i++) {
          const isPrimary = !hasPrimary && i === 0;
          const uploadResult = await uploadProductImage(id, newImages[i], isPrimary);

          if (uploadResult.error) {
            failedUploads.push(`${newImages[i].name}: ${uploadResult.error}`);
          }
        }

        if (failedUploads.length > 0) {
          setUploadErrors(failedUploads);
          return;
        }
      }

      router.push("/admin/produk");
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setNewImages((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExistingImage = async (imageId: string) => {
    if (!confirm("Yakin ingin menghapus foto ini?")) return;

    setDeletingImageId(imageId);
    const result = await deleteProductImage(imageId, id);

    if (result.error) {
      alert(`Gagal menghapus: ${result.error}`);
    } else {
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    }
    setDeletingImageId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-burgundy-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="mb-4 text-burgundy-600">Produk tidak ditemukan</p>
        <Button asChild>
          <Link href="/admin/produk">Kembali ke Daftar Produk</Link>
        </Button>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-burgundy-900">Edit Produk</h1>
          <p className="mt-1 text-burgundy-600">
            Ubah informasi produk {product.name}
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="error" title="Terjadi Kesalahan">
          {error}
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
            {existingImages.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium text-burgundy-700">
                  Foto Tersimpan
                </p>
                <div className="grid grid-cols-3 gap-2 sm:gap-4 sm:grid-cols-4 md:grid-cols-6">
                  {existingImages.map((image) => (
                    <div key={image.id} className="group relative aspect-square">
                      <Image
                        src={image.image_url}
                        alt="Product"
                        fill
                        className="rounded-lg object-cover"
                        sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 16vw"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteExistingImage(image.id)}
                        disabled={deletingImageId === image.id}
                        className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-50 sm:opacity-0 opacity-100"
                      >
                        {deletingImageId === image.id ? (
                          <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        )}
                      </button>
                      {image.is_primary && (
                        <span className="absolute bottom-1 left-1 rounded bg-burgundy-600 px-1 text-[10px] sm:text-xs text-white">
                          Utama
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-lg border-2 border-dashed border-burgundy-200 p-6">
              <label className="flex cursor-pointer flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-burgundy-400" />
                <span className="text-sm text-burgundy-600">
                  Klik untuk upload foto baru
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

            {newImages.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium text-burgundy-700">
                  Foto Baru (belum disimpan)
                </p>
                <div className="grid grid-cols-3 gap-2 sm:gap-4 sm:grid-cols-4 md:grid-cols-6">
                  {newImages.map((image, index) => (
                    <div key={index} className="group relative aspect-square">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-0 opacity-100"
                      >
                        <X className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  ))}
                </div>
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
              "Simpan Perubahan"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
