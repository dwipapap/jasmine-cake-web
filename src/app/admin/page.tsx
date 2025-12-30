import { Package, Folder, MessageSquare, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

interface RecentProduct {
  id: string;
  name: string;
  is_available: boolean;
}

const QUICK_ACTIONS = [
  { label: "Tambah Produk", href: "/admin/produk/tambah" },
  { label: "Kelola Kategori", href: "/admin/kategori" },
  { label: "Lihat Testimoni", href: "/admin/testimoni" },
];

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: totalProducts },
    { count: totalCategories },
    { count: totalTestimonials },
    { count: availableProducts },
    recentProductsResult,
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("testimonials").select("*", { count: "exact", head: true }),
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_available", true),
    supabase
      .from("products")
      .select("id, name, is_available")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const recentProducts = (recentProductsResult.data || []) as RecentProduct[];

  const stats = [
    {
      label: "Total Produk",
      value: String(totalProducts || 0),
      icon: Package,
      href: "/admin/produk",
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Kategori",
      value: String(totalCategories || 0),
      icon: Folder,
      href: "/admin/kategori",
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Testimoni",
      value: String(totalTestimonials || 0),
      icon: MessageSquare,
      href: "/admin/testimoni",
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Produk Tersedia",
      value: String(availableProducts || 0),
      icon: TrendingUp,
      href: "/admin/produk",
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-burgundy-900">Dashboard</h1>
        <p className="mt-1 text-burgundy-600">
          Selamat datang di panel admin Jasmine Cake and Cookies
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="p-6 transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-burgundy-600">{stat.label}</p>
                  <p className="mt-1 text-3xl font-bold text-burgundy-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`rounded-full p-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-burgundy-900">
            Aksi Cepat
          </h2>
          <div className="space-y-2">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="block rounded-lg border border-burgundy-200 p-3 text-burgundy-700 transition-colors hover:bg-burgundy-50"
              >
                {action.label}
              </Link>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-burgundy-900">
            Produk Terbaru
          </h2>
          {recentProducts.length > 0 ? (
            <div className="space-y-3">
              {recentProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/produk/${product.id}`}
                  className="flex items-center justify-between rounded-lg bg-cream-50 p-3 transition-colors hover:bg-cream-100"
                >
                  <span className="text-burgundy-700">{product.name}</span>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      product.is_available
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.is_available ? "Tersedia" : "Tidak Tersedia"}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-burgundy-500">
              Belum ada produk. Tambahkan produk pertama Anda!
            </p>
          )}
          <Link
            href="/admin/produk"
            className="mt-4 block text-center text-sm text-burgundy-600 hover:text-burgundy-800"
          >
            Lihat Semua Produk →
          </Link>
        </Card>
      </div>
    </div>
  );
}
