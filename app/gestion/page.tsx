export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { orders, products, installationRequests } from "@/lib/db/schema";
import { formatPrice } from "@/lib/constants";
import {
  Package,
  ShoppingBag,
  Wrench,
  AlertTriangle,
  ImageIcon,
  Settings,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

const LOW_STOCK = 5;

export default async function DashboardPage() {
  const [allProducts, allOrders, allInstalls] = await Promise.all([
    db.select().from(products),
    db.select().from(orders),
    db.select().from(installationRequests),
  ]);

  const pendingOrders = allOrders.filter((o) => o.status === "pending");
  const lowStock = allProducts.filter((p) => p.stock <= LOW_STOCK);
  const revenue = allOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const stats = [
    {
      label: "Chiffre d'affaires",
      value: formatPrice(revenue),
      icon: ShoppingBag,
      hint: `${allOrders.length} commande(s)`,
    },
    {
      label: "À traiter",
      value: String(pendingOrders.length),
      icon: AlertTriangle,
      hint: "commandes en attente",
    },
    {
      label: "Articles en stock",
      value: String(allProducts.length),
      icon: Package,
      hint: `${lowStock.length} en stock bas`,
    },
    {
      label: "Demandes de pose",
      value: String(allInstalls.length),
      icon: Wrench,
      hint: "installations",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-navy-900">Tableau de bord</h1>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <s.icon className="h-4 w-4 text-sky-600" />
            </div>
            <p className="mt-2 text-2xl font-bold text-navy-900">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.hint}</p>
          </div>
        ))}
      </div>

      {/* Stock bas */}
      {lowStock.length > 0 && (
        <div className="rounded-lg border border-cta-500/40 bg-cta-500/5 p-4">
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-cta-600">
            <AlertTriangle className="h-4 w-4" /> Stock bas à réapprovisionner
          </p>
          <ul className="text-sm">
            {lowStock.map((p) => (
              <li key={p.id} className="flex justify-between py-1">
                <span>{p.name}</span>
                <span className="font-medium">{p.stock} restant(s)</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Dernières commandes */}
      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="font-semibold text-navy-900">Dernières commandes</h2>
          <Link
            href="/gestion/commandes"
            className="text-sm text-sky-600 hover:underline"
          >
            Tout voir
          </Link>
        </div>
        {allOrders.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">
            Aucune commande pour le moment — elles apparaîtront ici dès que des
            clients commanderont.
          </p>
        ) : (
          <ul className="divide-y text-sm">
            {allOrders.slice(0, 5).map((o) => (
              <li
                key={o.id}
                className="flex items-center justify-between px-4 py-3"
              >
                <span className="font-medium">{o.number}</span>
                <span>{o.customerName}</span>
                <span>{formatPrice(o.total)}</span>
                <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs capitalize text-navy-900">
                  {o.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
