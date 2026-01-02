"use client";

import { useState, useEffect, useTransition } from "react";
import { Plus, Pencil, Trash2, GripVertical, Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBrowserClient } from "@/lib/supabase/client";
import { createCategory, updateCategory, deleteCategory } from "@/lib/actions";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
}

export default function AdminCategoryPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", slug: "" });
  const [newCategory, setNewCategory] = useState({ name: "", slug: "" });
  const [showAddForm, setShowAddForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      const supabase = createBrowserClient();
      const { data } = await supabase
        .from("categories")
        .select("id, name, slug, description, display_order")
        .order("display_order");

      if (data) {
        setCategories(data);
      }
      setIsLoading(false);
    }

    fetchCategories();
  }, []);

  const handleEdit = (category: CategoryItem) => {
    setEditingId(category.id);
    setEditForm({ name: category.name, slug: category.slug });
  };

  const handleSave = async (id: string) => {
    if (!editForm.name.trim()) return;

    setError(null);
    startTransition(async () => {
      const result = await updateCategory(id, {
        name: editForm.name,
        slug: editForm.slug || editForm.name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, ""),
      });

      if (result.error) {
        setError(result.error);
      } else {
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === id
              ? { ...cat, name: editForm.name, slug: editForm.slug || cat.slug }
              : cat
          )
        );
        setEditingId(null);
      }
    });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Yakin ingin menghapus kategori "${name}"? Produk dalam kategori ini akan kehilangan kategorinya.`)) {
      return;
    }

    setDeletingId(id);
    const result = await deleteCategory(id);

    if (result.error) {
      alert(`Gagal menghapus: ${result.error}`);
    } else {
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    }
    setDeletingId(null);
  };

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) return;

    setError(null);
    const slug = newCategory.slug || newCategory.name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

    startTransition(async () => {
      const result = await createCategory({
        name: newCategory.name,
        slug,
      });

      if ("error" in result) {
        setError(result.error ?? "Gagal menambahkan kategori");
        return;
      }

      const supabase = createBrowserClient();
      const { data } = await supabase
        .from("categories")
        .select("id, name, slug, description, display_order")
        .order("display_order");

      if (data) {
        setCategories(data);
      }
      setNewCategory({ name: "", slug: "" });
      setShowAddForm(false);
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
          <h1 className="text-2xl font-bold text-burgundy-900">
            Kelola Kategori
          </h1>
          <p className="mt-1 text-burgundy-600">
            {categories.length} kategori terdaftar
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4" />
          Tambah Kategori
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {showAddForm && (
        <Card className="p-4">
          <h3 className="mb-4 font-semibold text-burgundy-900">
            Tambah Kategori Baru
          </h3>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1 space-y-2">
              <Label htmlFor="name">Nama Kategori</Label>
              <Input
                id="name"
                placeholder="Contoh: Kue Ultah"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="slug">Slug (opsional)</Label>
              <Input
                id="slug"
                placeholder="contoh: kue-ultah"
                value={newCategory.slug}
                onChange={(e) =>
                  setNewCategory((prev) => ({ ...prev, slug: e.target.value }))
                }
              />
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={handleAddCategory} disabled={isPending}>
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Simpan"}
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Batal
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card className="divide-y divide-border">
        {categories.length === 0 ? (
          <div className="p-8 text-center text-burgundy-500">
            Belum ada kategori. Klik tombol &quot;Tambah Kategori&quot; untuk menambahkan.
          </div>
        ) : (
          categories.map((category, index) => (
            <div
              key={category.id}
              className="flex items-center gap-4 p-4 hover:bg-cream-50"
            >
              <GripVertical className="h-5 w-5 cursor-grab text-burgundy-300" />
              <span className="w-8 text-center text-sm text-burgundy-400">
                {index + 1}
              </span>
              <div className="flex-1">
                {editingId === category.id ? (
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Nama kategori"
                      className="max-w-xs"
                      autoFocus
                    />
                    <Input
                      value={editForm.slug}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, slug: e.target.value }))}
                      placeholder="slug"
                      className="max-w-[150px]"
                    />
                  </div>
                ) : (
                  <div>
                    <p className="font-medium text-burgundy-900">
                      {category.name}
                    </p>
                    <p className="text-sm text-burgundy-500">/{category.slug}</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {editingId === category.id ? (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleSave(category.id)}
                      disabled={isPending}
                      className="h-10 w-10 sm:h-9 sm:w-auto"
                    >
                      {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingId(null)}
                      className="h-10 w-10 sm:h-9 sm:w-auto"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(category)}
                      className="h-10 w-10 sm:h-9 sm:w-9"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700 h-10 w-10 sm:h-9 sm:w-9"
                      onClick={() => handleDelete(category.id, category.name)}
                      disabled={deletingId === category.id}
                    >
                      {deletingId === category.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
