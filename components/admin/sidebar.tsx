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
  Tag,
  FolderTree,
  ShieldCheck,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { SITE_NAME } from "@/lib/constants";

const ITEMS = [
  { href: "/gestion", icon: LayoutDashboard, label: "Tableau de bord" },
  { href: "/gestion/articles", icon: Package, label: "Articles" },
  { href: "/gestion/categories", icon: FolderTree, label: "Catégories" },
  { href: "/gestion/commandes", icon: ShoppingBag, label: "Commandes", badgeKey: "orders" },
  { href: "/gestion/installations", icon: Wrench, label: "Installations", badgeKey: "installations" },
  { href: "/gestion/clients", icon: Users, label: "Clients" },
  { href: "/gestion/promos", icon: Tag, label: "Codes promo" },
  { href: "/gestion/contenu", icon: ImageIcon, label: "Contenu du site" },
  { href: "/gestion/statistiques", icon: BarChart3, label: "Statistiques" },
  { href: "/gestion/comptes", icon: ShieldCheck, label: "Comptes admin" },
  { href: "/gestion/reglages", icon: Settings, label: "Réglages" },
] as const;

export interface SidebarBadges {
  orders?: number;
  installations?: number;
}

export function AdminSidebar({ badges }: { badges?: SidebarBadges }) {
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
                  <span className="flex-1">{item.label}</span>
                  {"badgeKey" in item &&
                    item.badgeKey != null &&
                    (badges?.[item.badgeKey] ?? 0) > 0 && (
                      <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-cta-500 px-1.5 text-[10px] font-bold text-white">
                        {badges?.[item.badgeKey]}
                      </span>
                    )}
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
