export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { orders, products, installationRequests } from "@/lib/db/schema";
import { formatPrice } from "@/lib/constants";
import { ShoppingCart, Package, Wrench, TrendingUp } from "lucide-react";

export default async function AdminStatsPage() {
  const [allOrders, allProducts, allInstalls] = await Promise.all([
    db.select().from(orders),
    db.select().from(products),
    db.select().from(installationRequests),
  ]);

  const completedOrders = allOrders.filter(
    (o) => o.status === "delivered"
  ).length;
  const pendingOrders = allOrders.filter((o) => o.status === "pending").length;
  const revenue = allOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);
  const avgOrder = allOrders.length ? Math.round(revenue / allOrders.length) : 0;

  const byStatus = [
    { label: "En attente", count: pendingOrders },
    {
      label: "Confirmées",
      count: allOrders.filter((o) => o.status === "confirmed").length,
    },
    {
      label: "Préparation",
      count: allOrders.filter((o) => o.status === "preparing").length,
    },
    { label: "Livrées", count: completedOrders },
    {
      label: "Annulées",
      count: allOrders.filter((o) => o.status === "cancelled").length,
    },
  ];

  const stats = [
    {
      label: "Chiffre d'affaires",
      value: formatPrice(revenue),
      icon: TrendingUp,
    },
    {
      label: "Commandes",
      value: String(allOrders.length),
      icon: ShoppingCart,
    },
    {
      label: "Articles",
      value: String(allProducts.length),
      icon: Package,
    },
    {
      label: "Installations",
      value: String(allInstalls.length),
      icon: Wrench,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-navy-900">Statistiques</h1>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <s.icon className="h-4 w-4 text-sky-600" />
            </div>
            <p className="mt-2 text-2xl font-bold text-navy-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-5">
          <h2 className="mb-3 font-semibold text-navy-900">
            Commandes par statut
          </h2>
          <ul className="space-y-2 text-sm">
            {byStatus.map((s) => (
              <li key={s.label} className="flex justify-between">
                <span className="text-muted-foreground">{s.label}</span>
                <span className="font-medium">{s.count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border bg-card p-5">
          <h2 className="mb-3 font-semibold text-navy-900">Panier moyen</h2>
          <p className="text-3xl font-bold text-navy-900">
            {formatPrice(avgOrder)}
          </p>
          <p className="text-sm text-muted-foreground">
            Sur {allOrders.length} commande(s)
          </p>
        </div>
      </div>
    </div>
  );
}
