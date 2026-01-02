"use client";

import Link from "next/link";
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createBrowserClient } from "@/lib/supabase/client";
import { deleteProduct } from "@/lib/actions";

interface Product {
  id: string;
  name: string;
  is_available: boolean;
  category: {
    id: string;
    name: string;
  } | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const supabase = createBrowserClient();

      const [productsResult, categoriesResult] = await Promise.all([
        supabase
          .from("products")
          .select(`
            id,
            name,
            is_available,
            category:categories(id, name)
          `)
          .order("created_at", { ascending: false }),
        supabase
          .from("categories")
          .select("id, name, slug")
          .order("display_order"),
      ]);

      if (productsResult.data) {
        setProducts(productsResult.data as Product[]);
      }
      if (categoriesResult.data) {
        setCategories(categoriesResult.data);
      }
      setIsLoading(false);
    }

    fetchData();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = selectedCategory
      ? product.category?.id === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Yakin ingin menghapus produk "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    startTransition(async () => {
      const result = await deleteProduct(id);
      if (result.error) {
        alert(`Gagal menghapus: ${result.error}`);
      } else {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
      setDeletingId(null);
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-burgundy-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-burgundy-900">Kelola Produk</h1>
          <p className="mt-1 text-burgundy-600">
            {products.length} produk terdaftar
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/produk/tambah">
            <Plus className="h-4 w-4" />
            Tambah Produk
          </Link>
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-burgundy-400" />
            <Input
              placeholder="Cari produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedCategory || ""}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-500"
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <div className="hidden lg:block overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full">
          <thead className="border-b border-border bg-cream-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-burgundy-700">
                Nama Produk
              </th>
              <th className="hidden px-4 py-3 text-left text-sm font-medium text-burgundy-700 md:table-cell">
                Kategori
              </th>
              <th className="hidden px-4 py-3 text-left text-sm font-medium text-burgundy-700 sm:table-cell">
                Status
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-burgundy-700">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-cream-50">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-burgundy-900">
                      {product.name}
                    </p>
                    <p className="text-sm text-burgundy-500 md:hidden">
                      {product.category?.name || "Tanpa Kategori"}
                    </p>
                  </div>
                </td>
                <td className="hidden px-4 py-3 text-sm text-burgundy-600 md:table-cell">
                  {product.category?.name || "Tanpa Kategori"}
                </td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      product.is_available
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.is_available ? "Tersedia" : "Tidak Tersedia"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/produk/${product.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleDelete(product.id, product.name)}
                      disabled={isPending && deletingId === product.id}
                    >
                      {isPending && deletingId === product.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden grid gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="p-4 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-burgundy-900">{product.name}</h3>
                <p className="text-sm text-burgundy-500">
                  {product.category?.name || "Tanpa Kategori"}
                </p>
              </div>
              <span
                className={`inline-flex rounded-full px-2 py-1 text-[10px] font-medium ${
                  product.is_available
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {product.is_available ? "Tersedia" : "Habis"}
              </span>
            </div>
            <div className="flex justify-end items-center gap-2 border-t border-cream-100 pt-3 mt-1">
              <Button variant="outline" size="sm" asChild className="flex-1 h-9">
                <Link href={`/admin/produk/${product.id}`}>
                  <Pencil className="h-3.5 w-3.5 mr-2" />
                  Edit
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-9 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                onClick={() => handleDelete(product.id, product.name)}
                disabled={isPending && deletingId === product.id}
              >
                {isPending && deletingId === product.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5 mr-2" />
                )}
                Hapus
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="p-8 text-center text-burgundy-500">
          {products.length === 0
            ? "Belum ada produk. Klik tombol \"Tambah Produk\" untuk menambahkan."
            : "Tidak ada produk yang ditemukan"}
        </div>
      )}
    </div>
  );
}
