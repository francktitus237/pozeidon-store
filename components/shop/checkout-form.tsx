"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CreditCard, ShoppingBag, Truck } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { createOrder } from "@/features/orders/actions";
import { DELIVERY_CITIES, PAYMENT_METHODS, formatPrice } from "@/lib/constants";
import type { PaymentMethod } from "@/types";

const inputCls =
  "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-sky-500";

export function CheckoutForm() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [city, setCity] = useState("Douala");
  const [payment, setPayment] = useState<PaymentMethod>("cash_on_delivery");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deliveryFee = DELIVERY_CITIES[city] ?? 0;
  const grandTotal = total + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
        <ShoppingBag className="h-14 w-14 text-muted-foreground/40" />
        <p className="text-muted-foreground">
          Votre panier est vide. Ajoutez des articles avant de commander.
        </p>
        <Link
          href="/boutique"
          className="rounded-lg bg-cta-500 px-6 py-3 font-semibold text-white hover:bg-cta-600"
        >
          Voir la boutique
        </Link>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const result = await createOrder({
        customerName: String(fd.get("customerName") ?? ""),
        phone: String(fd.get("phone") ?? ""),
        whatsapp: String(fd.get("whatsapp") ?? ""),
        email: String(fd.get("email") ?? ""),
        city,
        district: String(fd.get("district") ?? ""),
        landmark: String(fd.get("landmark") ?? ""),
        items,
        paymentMethod: payment,
      });

      if ("error" in result && result.error) {
        setError(result.error);
        return;
      }
      clearCart();
      router.push(`/commande/confirmation?numero=${result.number}`);
    } catch {
      setError(
        "Une erreur est survenue lors de l'enregistrement. Réessayez ou contactez-nous sur WhatsApp."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1fr_340px]">
      {/* Formulaire */}
      <div className="space-y-6">
        <section className="rounded-lg border bg-card p-5">
          <h2 className="mb-4 font-semibold text-navy-900">
            Coordonnées
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium">
                Nom complet *
              </label>
              <input name="customerName" required className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Téléphone *
              </label>
              <input
                name="phone"
                required
                inputMode="tel"
                placeholder="6XXXXXXXX"
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                WhatsApp (si différent)
              </label>
              <input
                name="whatsapp"
                inputMode="tel"
                placeholder="6XXXXXXXX"
                className={inputCls}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium">
                Email (optionnel)
              </label>
              <input name="email" type="email" className={inputCls} />
            </div>
          </div>
        </section>

        <section className="rounded-lg border bg-card p-5">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-navy-900">
            <Truck className="h-5 w-5 text-sky-600" /> Livraison
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Ville *</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={inputCls}
              >
                {Object.keys(DELIVERY_CITIES).map((c) => (
                  <option key={c} value={c}>
                    {c}
                    {DELIVERY_CITIES[c] === 0
                      ? " (gratuit)"
                      : ` (+${formatPrice(DELIVERY_CITIES[c])})`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Quartier *
              </label>
              <input
                name="district"
                required
                placeholder="Ex : Bonamoussadi"
                className={inputCls}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium">
                Point de repère (optionnel)
              </label>
              <input
                name="landmark"
                placeholder="Ex : en face de la pharmacie"
                className={inputCls}
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border bg-card p-5">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-navy-900">
            <CreditCard className="h-5 w-5 text-sky-600" /> Paiement
          </h2>
          <div className="space-y-2">
            {PAYMENT_METHODS.map((m) => (
              <label
                key={m.id}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition ${
                  payment === m.id
                    ? "border-navy-900 bg-sky-50 font-medium"
                    : "hover:border-sky-300"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={m.id}
                  checked={payment === m.id}
                  onChange={() => setPayment(m.id)}
                  className="h-4 w-4 accent-navy-900"
                />
                {m.label}
              </label>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Pour MoMo / Orange Money, notre équipe vous envoie les instructions
            de paiement après validation de la commande.
          </p>
        </section>
      </div>

      {/* Récapitulatif */}
      <aside className="h-fit rounded-lg border bg-card p-5 lg:sticky lg:top-24">
        <h2 className="mb-4 font-semibold text-navy-900">Votre commande</h2>
        <ul className="mb-4 space-y-2 text-sm">
          {items.map((i) => (
            <li key={i.productId} className="flex justify-between gap-2">
              <span className="min-w-0 flex-1 truncate">
                {i.quantity}× {i.name}
              </span>
              <span className="shrink-0 font-medium">
                {formatPrice(i.price * i.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <dl className="space-y-2 border-t pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Sous-total</dt>
            <dd className="font-medium">{formatPrice(total)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Livraison</dt>
            <dd className="font-medium">
              {deliveryFee === 0 ? "Gratuite" : formatPrice(deliveryFee)}
            </dd>
          </div>
          <div className="flex justify-between border-t pt-2 text-base font-bold text-navy-900">
            <dt>Total</dt>
            <dd>{formatPrice(grandTotal)}</dd>
          </div>
        </dl>

        {error && (
          <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-lg bg-cta-500 px-5 py-3 font-semibold text-white transition hover:bg-cta-600 disabled:opacity-50"
        >
          {loading ? "Validation…" : "Confirmer la commande"}
        </button>
      </aside>
    </form>
  );
}
