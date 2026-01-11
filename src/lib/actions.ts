"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const MAX_FILE_SIZE_5MB = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Tipe file tidak didukung. Gunakan: JPG, PNG, WebP, atau GIF`,
    };
  }

  if (file.size > MAX_FILE_SIZE_5MB) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `Ukuran file terlalu besar (${sizeMB}MB). Maksimal 5MB`,
    };
  }

  return { valid: true };
}

function extractStoragePath(publicUrl: string): string | null {
  const bucketPath = "/storage/v1/object/public/kue/";
  const index = publicUrl.indexOf(bucketPath);
  if (index === -1) return null;
  return publicUrl.substring(index + bucketPath.length);
}

export async function createProduct(formData: {
  name: string;
  description?: string;
  price?: number | null;
  category_id?: string | null;
  is_available: boolean;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .insert({
      name: formData.name,
      description: formData.description || null,
      price: formData.price ?? null,
      category_id: formData.category_id,
      is_available: formData.is_available,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/produk");
  revalidatePath("/galeri");
  revalidatePath("/");

  return { data };
}

export async function updateProduct(
  id: string,
  formData: {
    name: string;
    description?: string;
    price?: number | null;
    category_id?: string | null;
    is_available: boolean;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .update({
      name: formData.name,
      description: formData.description || null,
      price: formData.price ?? null,
      category_id: formData.category_id,
      is_available: formData.is_available,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/produk");
  revalidatePath(`/produk/${id}`);
  revalidatePath("/galeri");
  revalidatePath("/");

  return { success: true };
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();

  const { data: images } = await supabase
    .from("product_images")
    .select("image_url")
    .eq("product_id", id);

  const { error: imagesError } = await supabase
    .from("product_images")
    .delete()
    .eq("product_id", id);

  if (imagesError) {
    return { error: imagesError.message };
  }

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  if (images && images.length > 0) {
    const storagePaths = images
      .map((img) => extractStoragePath(img.image_url))
      .filter((path): path is string => path !== null);

    if (storagePaths.length > 0) {
      await supabase.storage.from("kue").remove(storagePaths);
    }
  }

  revalidatePath("/admin/produk");
  revalidatePath("/galeri");
  revalidatePath("/");

  return { success: true };
}

export async function uploadProductImage(formData: FormData) {
  const productId = formData.get("productId") as string;
  const file = formData.get("file") as File;
  const isPrimary = formData.get("isPrimary") === "true";

  if (!productId || !file) {
    return { error: "Data tidak lengkap" };
  }

  const validation = validateImageFile(file);
  if (!validation.valid) {
    return { error: validation.error };
  }

  const supabase = await createClient();

  const fileExt = file.name.split(".").pop();
  const fileName = `${productId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("kue")
    .upload(fileName, file);

  if (uploadError) {
    return { error: uploadError.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("kue").getPublicUrl(fileName);

  const { data: maxOrderData } = await supabase
    .from("product_images")
    .select("display_order")
    .eq("product_id", productId)
    .order("display_order", { ascending: false })
    .limit(1)
    .single();

  const nextDisplayOrder = (maxOrderData?.display_order ?? 0) + 1;

  if (isPrimary) {
    await supabase
      .from("product_images")
      .update({ is_primary: false })
      .eq("product_id", productId)
      .eq("is_primary", true);
  }

  const { error: dbError } = await supabase.from("product_images").insert({
    product_id: productId,
    image_url: publicUrl,
    is_primary: isPrimary,
    display_order: nextDisplayOrder,
  });

  if (dbError) {
    await supabase.storage.from("kue").remove([fileName]);
    return { error: dbError.message };
  }

  revalidatePath(`/admin/produk/${productId}`);
  revalidatePath(`/produk/${productId}`);

  return { success: true, url: publicUrl };
}

export async function deleteProductImage(imageId: string, productId: string) {
  const supabase = await createClient();

  const { data: imageRecord } = await supabase
    .from("product_images")
    .select("image_url")
    .eq("id", imageId)
    .single();

  const { error } = await supabase
    .from("product_images")
    .delete()
    .eq("id", imageId);

  if (error) {
    return { error: error.message };
  }

  if (imageRecord?.image_url) {
    const storagePath = extractStoragePath(imageRecord.image_url);
    if (storagePath) {
      await supabase.storage.from("kue").remove([storagePath]);
    }
  }

  revalidatePath(`/admin/produk/${productId}`);
  revalidatePath(`/produk/${productId}`);

  return { success: true };
}

export async function createCategory(formData: {
  name: string;
  slug: string;
  description?: string;
}) {
  const supabase = await createClient();

  const { data: maxOrder } = await supabase
    .from("categories")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .single();

  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: formData.name,
      slug: formData.slug,
      description: formData.description || null,
      display_order: (maxOrder?.display_order || 0) + 1,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/kategori");
  revalidatePath("/galeri");
  revalidatePath("/");

  return { data };
}

export async function updateCategory(
  id: string,
  formData: { name: string; slug: string; description?: string }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("categories")
    .update({
      name: formData.name,
      slug: formData.slug,
      description: formData.description || null,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/kategori");
  revalidatePath("/galeri");
  revalidatePath("/");

  return { success: true };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/kategori");
  revalidatePath("/galeri");
  revalidatePath("/");

  return { success: true };
}

export async function toggleTestimonialFeatured(
  id: string,
  isFeatured: boolean
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("testimonials")
    .update({ is_featured: isFeatured })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/testimoni");
  revalidatePath("/testimoni");

  return { success: true };
}

export async function deleteTestimonial(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("testimonials").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/testimoni");
  revalidatePath("/testimoni");

  return { success: true };
}

export async function uploadTestimonialImage(file: File) {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    return { error: validation.error };
  }

  const supabase = await createClient();

  const fileExt = file.name.split(".").pop();
  const fileName = `testimonials/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("kue")
    .upload(fileName, file);

  if (uploadError) {
    return { error: uploadError.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("kue").getPublicUrl(fileName);

  return { success: true, url: publicUrl };
}

export async function createTestimonial(formData: {
  customer_name: string;
  message: string;
  product_id?: string;
  image_url?: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("testimonials")
    .insert({
      customer_name: formData.customer_name,
      message: formData.message,
      product_id: formData.product_id || null,
      image_url: formData.image_url || null,
      is_featured: false,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/testimoni");
  revalidatePath("/testimoni");

  return { success: true, data };
}
