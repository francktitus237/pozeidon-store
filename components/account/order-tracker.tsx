"use client";

import { useState } from "react";
import { Search, Package, MessageCircle } from "lucide-react";
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

export function OrderTracker() {
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
        <div className="mt-6 space-y-4 rounded-lg border bg-sky-50 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Commande {order.number}
              </p>
              <p className="text-lg font-bold text-navy-900">
                {STATUS_LABEL[order.status] ?? order.status}
              </p>
            </div>
            <Package className="h-6 w-6 text-sky-600" />
          </div>

          <div className="grid gap-2 text-sm">
            <p>
              <span className="text-muted-foreground">Client :</span>{" "}
              {order.customerName}
            </p>
            <p>
              <span className="text-muted-foreground">Téléphone :</span>{" "}
              {order.phone}
            </p>
            <p>
              <span className="text-muted-foreground">Livraison :</span>{" "}
              {order.district}, {order.city}
            </p>
            <p>
              <span className="text-muted-foreground">Total :</span>{" "}
              {formatPrice(order.total)}
            </p>
            <p>
              <span className="text-muted-foreground">Paiement :</span>{" "}
              {order.paymentMethod === "cash_on_delivery"
                ? "Paiement à la livraison"
                : order.paymentMethod}
            </p>
          </div>

          <a
            href={`https://wa.me/${CONTACT.whatsapp}?text=Bonjour,+je+souhaite+des+infos+sur+ma+commande+${order.number}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-whatsapp-500 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            <MessageCircle className="h-4 w-4" /> Contacter le support
          </a>
        </div>
      )}
    </div>
  );
}
