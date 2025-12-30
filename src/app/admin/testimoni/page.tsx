"use client";

import { useState, useEffect, useTransition } from "react";
import { Star, StarOff, Trash2, Eye, Loader2, Link2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createBrowserClient } from "@/lib/supabase/client";
import { toggleTestimonialFeatured, deleteTestimonial } from "@/lib/actions";

interface Testimonial {
  id: string;
  customer_name: string;
  message: string;
  is_featured: boolean;
  created_at: string;
  product: {
    id: string;
    name: string;
  } | null;
}

export default function AdminTestimoniPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const formLink = typeof window !== "undefined" 
    ? `${window.location.origin}/testimoni/tambah` 
    : "/testimoni/tambah";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(formLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      alert(`Link: ${formLink}`);
    }
  };

  useEffect(() => {
    async function fetchTestimonials() {
      const supabase = createBrowserClient();
      const { data } = await supabase
        .from("testimonials")
        .select(`
          id,
          customer_name,
          message,
          is_featured,
          created_at,
          product:products(id, name)
        `)
        .order("created_at", { ascending: false });

      if (data) {
        setTestimonials(data as Testimonial[]);
      }
      setIsLoading(false);
    }

    fetchTestimonials();
  }, []);

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    setTogglingId(id);
    startTransition(async () => {
      const result = await toggleTestimonialFeatured(id, !currentStatus);

      if (result.error) {
        alert(`Gagal mengubah status: ${result.error}`);
      } else {
        setTestimonials((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, is_featured: !currentStatus } : t
          )
        );
      }
      setTogglingId(null);
    });
  };

  const handleDelete = async (id: string, customerName: string) => {
    if (!confirm(`Yakin ingin menghapus testimoni dari "${customerName}"?`)) {
      return;
    }

    setDeletingId(id);
    const result = await deleteTestimonial(id);

    if (result.error) {
      alert(`Gagal menghapus: ${result.error}`);
    } else {
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    }
    setDeletingId(null);
  };

  const featuredCount = testimonials.filter((t) => t.is_featured).length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
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
            Kelola Testimoni
          </h1>
          <p className="mt-1 text-burgundy-600">
            {testimonials.length} testimoni, {featuredCount} ditampilkan sebagai
            pilihan
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={handleCopyLink}
            className="gap-2"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-600" />
                Link Tersalin!
              </>
            ) : (
              <>
                <Link2 className="h-4 w-4" />
                Salin Link Form
              </>
            )}
          </Button>
          <Button asChild>
            <a href="/testimoni" target="_blank" rel="noopener noreferrer">
              <Eye className="h-4 w-4" />
              Lihat Halaman Testimoni
            </a>
          </Button>
        </div>
      </div>

      {testimonials.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-burgundy-500">
            Belum ada testimoni. Testimoni dapat ditambahkan melalui Supabase
            dashboard atau form publik.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-4">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <p className="font-semibold text-burgundy-900">
                    {testimonial.customer_name}
                  </p>
                  {testimonial.product && (
                    <p className="text-sm text-burgundy-500">
                      {testimonial.product.name}
                    </p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleToggleFeatured(testimonial.id, testimonial.is_featured)
                    }
                    disabled={isPending && togglingId === testimonial.id}
                    className={
                      testimonial.is_featured
                        ? "text-yellow-500 hover:text-yellow-600"
                        : "text-burgundy-300 hover:text-burgundy-500"
                    }
                  >
                    {isPending && togglingId === testimonial.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : testimonial.is_featured ? (
                      <Star className="h-4 w-4 fill-current" />
                    ) : (
                      <StarOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() =>
                      handleDelete(testimonial.id, testimonial.customer_name)
                    }
                    disabled={deletingId === testimonial.id}
                  >
                    {deletingId === testimonial.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <p className="line-clamp-3 text-sm text-burgundy-700">
                &ldquo;{testimonial.message}&rdquo;
              </p>
              <p className="mt-2 text-xs text-burgundy-400">
                {formatDate(testimonial.created_at)}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
