export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { orders, products, installationRequests } from "@/lib/db/schema";
import { formatPrice } from "@/lib/constants";
import {
  Package,
  ShoppingBag,
  Wrench,
  AlertTriangle,
  Plus,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { KpiCard } from "@/components/admin/kpi-card";

const LOW_STOCK = 5;

const ORDER_STATUS: Record<string, { label: string; className: string }> = {
  pending: { label: "En attente", className: "bg-amber-100 text-amber-700" },
  confirmed: { label: "Confirmée", className: "bg-sky-100 text-sky-700" },
  preparing: { label: "Préparation", className: "bg-violet-100 text-violet-700" },
  delivered: { label: "Livrée", className: "bg-emerald-100 text-emerald-700" },
  cancelled: { label: "Annulée", className: "bg-red-100 text-red-700" },
};

const INSTALL_STATUS: Record<string, { label: string; className: string }> = {
  new: { label: "Nouvelle", className: "bg-amber-100 text-amber-700" },
  quoted: { label: "Devis envoyé", className: "bg-sky-100 text-sky-700" },
  scheduled: { label: "Planifiée", className: "bg-violet-100 text-violet-700" },
  done: { label: "Réalisée", className: "bg-emerald-100 text-emerald-700" },
  cancelled: { label: "Annulée", className: "bg-red-100 text-red-700" },
};

function dateDesc(a: { createdAt: Date | string }, b: { createdAt: Date | string }) {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

export default async function DashboardPage() {
  const [allProducts, allOrders, allInstalls] = await Promise.all([
    db.select().from(products),
    db.select().from(orders),
    db.select().from(installationRequests),
  ]);

  const pendingOrders = allOrders.filter((o) => o.status === "pending");
  const confirmedOrders = allOrders.filter((o) => o.status === "confirmed");
  const lowStock = allProducts
    .filter((p) => p.stock > 0 && p.stock <= LOW_STOCK)
    .sort((a, b) => a.stock - b.stock);
  const outOfStock = allProducts.filter(
    (p) => p.status === "out_of_stock" || p.stock === 0
  );
  const revenue = allOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const latestOrders = [...allOrders].sort(dateDesc).slice(0, 6);
  const latestInstalls = [...allInstalls].sort(dateDesc).slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-navy-900">Tableau de bord</h1>
        <div className="flex items-center gap-2">
          <Link
            href="/gestion/articles"
            className="inline-flex items-center gap-1.5 rounded-md border bg-white px-3 py-1.5 text-sm font-medium text-navy-900 hover:bg-sky-50"
          >
            <Plus className="h-4 w-4" /> Ajouter un article
          </Link>
          <Link
            href="/gestion/commandes"
            className="inline-flex items-center gap-1.5 rounded-md bg-navy-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-navy-800"
          >
            Commandes <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* KPI */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Chiffre d'affaires"
          value={formatPrice(revenue)}
          hint={`${allOrders.length} commande(s)`}
          icon={ShoppingBag}
          href="/gestion/statistiques"
          color="emerald"
        />
        <KpiCard
          label="À traiter"
          value={String(pendingOrders.length + confirmedOrders.length)}
          hint={`${pendingOrders.length} en attente · ${confirmedOrders.length} confirmées`}
          icon={AlertTriangle}
          href="/gestion/commandes"
          color="orange"
        />
        <KpiCard
          label="Articles en stock"
          value={String(allProducts.length)}
          hint={`${lowStock.length} en stock bas · ${outOfStock.length} épuisé(s)`}
          icon={Package}
          href="/gestion/articles"
          color="sky"
        />
        <KpiCard
          label="Demandes de pose"
          value={String(allInstalls.length)}
          hint="installations"
          icon={Wrench}
          href="/gestion/installations"
          color="violet"
        />
      </div>

      {/* Alertes stock */}
      {(lowStock.length > 0 || outOfStock.length > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          {lowStock.length > 0 && (
            <div className="rounded-lg border border-amber-300 bg-amber-50/60 p-4">
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-700">
                <AlertTriangle className="h-4 w-4" /> Stock bas
              </p>
              <ul className="space-y-1.5 text-sm">
                {lowStock.map((p) => (
                  <li key={p.id} className="flex justify-between">
                    <Link
                      href="/gestion/articles"
                      className="truncate hover:underline"
                    >
                      {p.name}
                    </Link>
                    <span className="font-medium">{p.stock} restant(s)</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {outOfStock.length > 0 && (
            <div className="rounded-lg border border-red-300 bg-red-50/60 p-4">
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-red-700">
                <AlertTriangle className="h-4 w-4" /> Articles épuisés
              </p>
              <ul className="space-y-1.5 text-sm">
                {outOfStock.slice(0, 6).map((p) => (
                  <li key={p.id} className="flex justify-between">
                    <Link
                      href="/gestion/articles"
                      className="truncate hover:underline"
                    >
                      {p.name}
                    </Link>
                    <span className="font-medium">0 en stock</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Listes */}
      <div className="grid gap-6 xl:grid-cols-2">
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
              {latestOrders.map((o) => {
                const status = ORDER_STATUS[o.status] ?? {
                  label: o.status,
                  className: "bg-slate-100 text-slate-700",
                };
                return (
                  <li
                    key={o.id}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <div className="min-w-0">
                      <Link
                        href={`/gestion/commandes/${o.id}`}
                        className="font-medium hover:underline"
                      >
                        {o.number}
                      </Link>
                      <p className="truncate text-xs text-muted-foreground">
                        {o.customerName} · {o.city}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-right">
                      <span className="font-medium">{formatPrice(o.total)}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Dernières installations */}
        <div className="rounded-lg border bg-card">
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="font-semibold text-navy-900">
              Dernières demandes d&apos;installation
            </h2>
            <Link
              href="/gestion/installations"
              className="text-sm text-sky-600 hover:underline"
            >
              Tout voir
            </Link>
          </div>
          {allInstalls.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">
              Aucune demande d&apos;installation pour le moment.
            </p>
          ) : (
            <ul className="divide-y text-sm">
              {latestInstalls.map((i) => {
                const status = INSTALL_STATUS[i.status] ?? {
                  label: i.status,
                  className: "bg-slate-100 text-slate-700",
                };
                return (
                  <li
                    key={i.id}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="font-medium">{i.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {i.city} · {i.placeType}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
