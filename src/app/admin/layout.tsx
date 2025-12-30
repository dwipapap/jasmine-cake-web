"use client";

import { useRouter, usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin";
import { createBrowserClient } from "@/lib/supabase/client";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createBrowserClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-cream-100">
      <AdminSidebar onLogout={handleLogout} />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 pt-16 lg:pt-6">{children}</div>
      </main>
    </div>
  );
}
