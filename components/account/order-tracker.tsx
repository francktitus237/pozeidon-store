"use client";

import { useState } from "react";
import {
  Search,
  Package,
  MessageCircle,
  Check,
  Truck,
  XCircle,
  MapPin,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackOrder } from "@/features/orders/actions";
import { CONTACT, formatPrice } from "@/lib/constants";

type Order = NonNullable<Awaited<ReturnType<typeof trackOrder>>>;

const STATUS_LABEL: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  preparing: "Préparation",
  delivered: "Livrée",
  cancelled: "Annulée",
};

const PAYMENT_LABEL: Record<string, string> = {
  mtn_momo: "MTN Mobile Money",
  orange_money: "Orange Money",
  cash_on_delivery: "Paiement à la livraison",
};

const STEPS = [
  { key: "pending", label: "Reçue" },
  { key: "confirmed", label: "Confirmée" },
  { key: "preparing", label: "Préparation" },
  { key: "delivered", label: "Livrée" },
];

export function OrderTracker({
  whatsapp = CONTACT.whatsapp,
}: {
  whatsapp?: string;
}) {
  const [number, setNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOrder(null);
    setError("");
    if (!number.trim() || !phone.trim()) {
      setError("Renseignez le numéro de commande et le téléphone.");
      return;
    }
    setLoading(true);
    const result = await trackOrder(number, phone);
    setLoading(false);
    if (!result) {
      setError("Commande introuvable. Vérifiez vos informations.");
    } else {
      setOrder(result);
    }
  }

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-navy-900">
        Suivi de commande
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Entrez votre numéro de commande et le téléphone renseigné à la commande.
      </p>

      <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Numéro de commande
          </label>
          <Input
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="PZE-XXXXXXX"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Téléphone</label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Ex : 6XXXXXXXX"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-navy-900 text-white hover:bg-navy-700"
        >
          <Search className="mr-1 h-4 w-4" />
          {loading ? "Recherche…" : "Rechercher"}
        </Button>
      </form>

      {error && (
        <p className="mt-4 text-center text-sm text-destructive">{error}</p>
      )}

      {order && (
        <div className="mt-6 rounded-lg border bg-card">
          {/* En-tête */}
          <div className="flex items-center justify-between border-b bg-sky-50 px-4 py-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Commande
              </p>
              <p className="font-mono font-bold text-navy-900">
                {order.number}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                order.status === "cancelled"
                  ? "bg-destructive/10 text-destructive"
                  : order.status === "delivered"
                    ? "bg-stock-in/10 text-stock-in"
                    : "bg-cta-500/10 text-cta-600"
              }`}
            >
              {STATUS_LABEL[order.status] ?? order.status}
            </span>
          </div>

          {/* Stepper de progression */}
          {order.status !== "cancelled" && (
            <div className="flex items-center px-4 py-5">
              {STEPS.map((step, i) => {
                const currentIdx = STEPS.findIndex(
                  (s) => s.key === order.status
                );
                const done = i <= (currentIdx < 0 ? 0 : currentIdx);
                return (
                  <div
                    key={step.key}
                    className="flex flex-1 items-center last:flex-none"
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full border-2 ${
                          done
                            ? "border-sky-600 bg-sky-600 text-white"
                            : "border-muted bg-background text-muted-foreground"
                        }`}
                      >
                        {done ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <span className="text-xs">{i + 1}</span>
                        )}
                      </div>
                      <span
                        className={`mt-1 text-[11px] ${
                          done
                            ? "font-medium text-navy-900"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div
                        className={`mx-2 mb-4 h-0.5 flex-1 ${
                          i < (currentIdx < 0 ? 0 : currentIdx)
                            ? "bg-sky-600"
                            : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {order.status === "cancelled" && (
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-destructive">
              <XCircle className="h-4 w-4" /> Cette commande a été annulée.
            </div>
          )}

          {/* Articles */}
          <div className="border-t px-4 py-3">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Truck className="h-3.5 w-3.5" /> Contenu de la commande
            </p>
            <ul className="divide-y text-sm">
              {order.items.map((item, i) => (
                <li key={i} className="flex justify-between py-2">
                  <span>
                    {item.name}
                    <span className="text-muted-foreground">
                      {" "}
                      × {item.quantity}
                    </span>
                  </span>
                  <span className="font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Récapitulatif */}
          <div className="space-y-1.5 border-t bg-sky-50/50 px-4 py-3 text-sm">
            <p className="flex items-center gap-2 text-muted-foreground">
              <Package className="h-3.5 w-3.5" /> {order.customerName} ·{" "}
              {order.phone}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> {order.district}, {order.city}
              {order.landmark ? ` (${order.landmark})` : ""}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <CreditCard className="h-3.5 w-3.5" />{" "}
              {PAYMENT_LABEL[order.paymentMethod] ?? order.paymentMethod}
            </p>
            <div className="flex justify-between border-t pt-2 text-base font-bold text-navy-900">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Support */}
          <div className="border-t p-4">
            <a
              href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Bonjour, je souhaite des infos sur ma commande ${order.number}.`)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-whatsapp-500 px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" /> Contacter le support
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
