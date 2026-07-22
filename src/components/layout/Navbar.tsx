"use client";

import { Home, Images, MessageSquareQuote, Info } from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";

const navItems = [
  { name: "Beranda", url: "/", icon: Home },
  { name: "Galeri", url: "/galeri", icon: Images },
  { name: "Testimoni", url: "/testimoni", icon: MessageSquareQuote },
  { name: "Tentang", url: "/tentang", icon: Info },
];

export function Navbar() {
  return <NavBar items={navItems} />;
}
