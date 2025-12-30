"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createProduct(formData: {
  name: string;
  description?: string;
  category_id: string;
  is_available: boolean;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .insert({
      name: formData.name,
      description: formData.description || null,
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
    category_id: string;
    is_available: boolean;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .update({
      name: formData.name,
      description: formData.description || null,
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

  revalidatePath("/admin/produk");
  revalidatePath("/galeri");
  revalidatePath("/");

  return { success: true };
}

export async function uploadProductImage(
  productId: string,
  file: File,
  isPrimary: boolean = false
) {
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

  if (isPrimary) {
    await supabase
      .from("product_images")
      .update({ is_primary: false })
      .eq("product_id", productId);
  }

  const { error: dbError } = await supabase.from("product_images").insert({
    product_id: productId,
    image_url: publicUrl,
    is_primary: isPrimary,
  });

  if (dbError) {
    return { error: dbError.message };
  }

  revalidatePath(`/admin/produk/${productId}`);
  revalidatePath(`/produk/${productId}`);

  return { success: true, url: publicUrl };
}

export async function deleteProductImage(imageId: string, productId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("product_images")
    .delete()
    .eq("id", imageId);

  if (error) {
    return { error: error.message };
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
