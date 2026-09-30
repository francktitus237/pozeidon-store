"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Wrench,
  Users,
  ImageIcon,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { SITE_NAME } from "@/lib/constants";

const ITEMS = [
  { href: "/gestion", icon: LayoutDashboard, label: "Tableau de bord" },
  { href: "/gestion/articles", icon: Package, label: "Articles" },
  { href: "/gestion/commandes", icon: ShoppingBag, label: "Commandes" },
  { href: "/gestion/installations", icon: Wrench, label: "Installations" },
  { href: "/gestion/clients", icon: Users, label: "Clients" },
  { href: "/gestion/bannieres", icon: ImageIcon, label: "Bannières" },
  { href: "/gestion/statistiques", icon: BarChart3, label: "Statistiques" },
  { href: "/gestion/reglages", icon: Settings, label: "Réglages" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-navy-900 text-sky-100">
      <div className="flex h-16 items-center gap-2.5 border-b border-navy-700 px-4">
        <Image
          src="/logo-mark.png"
          alt={SITE_NAME}
          width={32}
          height={32}
          className="h-8 w-8 object-contain"
        />
        <div>
          <p className="text-sm font-bold leading-tight text-white">
            Pozeidon
          </p>
          <p className="text-[10px] uppercase tracking-wider text-sky-300">
            Espace de gestion
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="flex flex-col gap-1">
          {ITEMS.map((item) => {
            const isActive =
              item.href === "/gestion"
                ? pathname === "/gestion"
                : pathname?.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-sky-500/20 text-white"
                      : "text-sky-100 hover:bg-navy-700 hover:text-white"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-navy-700 p-3">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-sky-100 hover:bg-navy-700 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
