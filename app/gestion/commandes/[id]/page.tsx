import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowLeft,
  Package,
  Truck,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Tag,
} from "lucide-react";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { formatPrice } from "@/lib/constants";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import type { OrderStatus } from "@/types";

export const metadata: Metadata = { title: "Détail commande — Admin" };
export const dynamic = "force-dynamic";

const PAYMENT_LABELS: Record<string, string> = {
  mtn_momo: "MTN Mobile Money",
  orange_money: "Orange Money",
  cash_on_delivery: "Paiement à la livraison",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  preparing: "En préparation",
  delivered: "Livrée",
  cancelled: "Annulée",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [order] = await db.select().from(orders).where(eq(orders.id, id));
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-3xl p-6">
      <Link
        href="/gestion/commandes"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-sky-600 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Retour aux commandes
      </Link>

      {/* En-tête */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-mono text-2xl font-bold text-navy-900">
            {order.number}
          </h1>
          <p className="text-sm text-muted-foreground">
            Passée le{" "}
            {new Date(order.createdAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-muted-foreground">
            Statut : {STATUS_LABELS[order.status] ?? order.status}
          </span>
          <OrderStatusSelect
            orderId={order.id}
            current={order.status as OrderStatus}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Client */}
        <section className="rounded-lg border bg-card p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <Truck className="h-4 w-4" /> Client &amp; livraison
          </h2>
          <p className="font-semibold text-navy-900">{order.customerName}</p>
          <div className="mt-2 flex flex-col gap-1.5 text-sm">
            <p className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              <a
                href={`tel:+${order.phone}`}
                className="text-sky-600 hover:underline"
              >
                +{order.phone}
              </a>
              {order.whatsapp && (
                <span className="text-xs text-muted-foreground">
                  (WhatsApp : +{order.whatsapp})
                </span>
              )}
            </p>
            {order.email && (
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                {order.email}
              </p>
            )}
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-3.5 w-3.5 text-muted-foreground" />
              <span>
                {order.district}, {order.city}
                {order.landmark ? (
                  <span className="block text-xs text-muted-foreground">
                    Repère : {order.landmark}
                  </span>
                ) : null}
              </span>
            </p>
          </div>
        </section>

        {/* Paiement */}
        <section className="rounded-lg border bg-card p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <CreditCard className="h-4 w-4" /> Paiement
          </h2>
          <p className="font-semibold text-navy-900">
            {PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}
          </p>
          {order.promoCode && (
            <p className="mt-2 flex items-center gap-2 text-sm">
              <Tag className="h-3.5 w-3.5 text-cta-500" />
              Code <span className="font-mono font-bold">{order.promoCode}</span>
              <span className="text-cta-600">
                (-{formatPrice(order.discount)})
              </span>
            </p>
          )}
        </section>
      </div>

      {/* Articles */}
      <section className="mt-4 rounded-lg border bg-card">
        <h2 className="flex items-center gap-2 border-b px-5 py-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          <Package className="h-4 w-4" /> Articles ({order.items.length})
        </h2>
        <ul className="divide-y">
          {order.items.map((item, i) => (
            <li key={i} className="flex items-center gap-4 px-5 py-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-sky-50">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <Package className="absolute inset-0 m-auto h-5 w-5 text-muted-foreground/40" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/produit/${item.slug}`}
                  className="font-medium text-navy-900 hover:underline"
                >
                  {item.name}
                </Link>
                <p className="text-xs text-muted-foreground">
                  {formatPrice(item.price)} × {item.quantity}
                  {item.withInstallation ? " · + installation" : ""}
                </p>
              </div>
              <p className="font-semibold text-navy-900">
                {formatPrice(item.price * item.quantity)}
              </p>
            </li>
          ))}
        </ul>

        {/* Totaux */}
        <div className="flex flex-col gap-1.5 border-t px-5 py-4 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Sous-total</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-cta-600">
              <span>Remise ({order.promoCode})</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-muted-foreground">
            <span>Livraison</span>
            <span>
              {order.deliveryFee === 0
                ? "Gratuite"
                : formatPrice(order.deliveryFee)}
            </span>
          </div>
          <div className="flex justify-between border-t pt-2 text-base font-bold text-navy-900">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
