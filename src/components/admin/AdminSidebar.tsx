"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Folder,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ChefHat,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SIDEBAR_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produk", label: "Produk", icon: Package },
  { href: "/admin/kategori", label: "Kategori", icon: Folder },
  { href: "/admin/testimoni", label: "Testimoni", icon: MessageSquare },
];

interface AdminSidebarProps {
  onLogout: () => void;
}

export function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <>
      <div className="flex h-16 items-center gap-2 border-b border-burgundy-200 px-4">
        <ChefHat className="h-6 w-6 text-burgundy-600" />
        <span className="font-bold text-burgundy-900">Admin Panel</span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {SIDEBAR_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive(item.href)
                ? "bg-burgundy-100 text-burgundy-900"
                : "text-burgundy-600 hover:bg-burgundy-50 hover:text-burgundy-900"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-burgundy-200 p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-burgundy-600 hover:bg-burgundy-50 hover:text-burgundy-900"
          onClick={onLogout}
        >
          <LogOut className="h-5 w-5" />
          Keluar
        </Button>
        <Link
          href="/"
          className="mt-2 flex items-center justify-center rounded-lg px-3 py-2 text-sm text-burgundy-500 hover:text-burgundy-700"
        >
          ← Kembali ke Website
        </Link>
      </div>
    </>
  );

  return (
    <>
      <button
        className="fixed left-4 top-4 z-50 rounded-lg bg-white p-2 shadow-md lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? (
          <X className="h-6 w-6 text-burgundy-600" />
        ) : (
          <Menu className="h-6 w-6 text-burgundy-600" />
        )}
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-white shadow-lg transition-transform lg:relative lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
