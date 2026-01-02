"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Folder,
  MessageSquare,
  LogOut,
  ChefHat,
} from "lucide-react";
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

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  const desktopSidebar = (
    <aside className="hidden w-64 flex-col border-r border-burgundy-200 bg-white lg:flex">
      <div className="flex h-16 items-center gap-2 border-b border-burgundy-200 px-6">
        <ChefHat className="h-6 w-6 text-burgundy-600" />
        <span className="font-serif text-xl font-bold text-burgundy-900">
          Admin Panel
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {SIDEBAR_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
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
    </aside>
  );

  const mobileBottomNav = (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-cream-200 bg-white pb-safe lg:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {SIDEBAR_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-1 px-1 py-1 sm:px-3 sm:py-2"
            >
              <div
                className={cn(
                  "flex items-center justify-center rounded-full px-4 py-1.5 transition-all duration-200",
                  active
                    ? "bg-burgundy-100 text-burgundy-700"
                    : "text-burgundy-400"
                )}
              >
                <item.icon className="h-5 w-5" />
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors duration-200",
                  active ? "text-burgundy-700" : "text-burgundy-400"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
        <button
          onClick={onLogout}
          className="flex flex-col items-center justify-center gap-1 px-1 py-1 sm:px-3 sm:py-2"
        >
          <div className="flex items-center justify-center rounded-full px-4 py-1.5 text-burgundy-400 transition-all duration-200 hover:bg-burgundy-50 hover:text-burgundy-700">
            <LogOut className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-medium text-burgundy-400 transition-colors duration-200">
            Keluar
          </span>
        </button>
      </div>
    </nav>
  );

  return (
    <>
      {desktopSidebar}
      {mobileBottomNav}
    </>
  );
}
