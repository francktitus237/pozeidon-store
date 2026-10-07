"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CreditCard, ShoppingBag, Truck } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { checkPromo, createOrder } from "@/features/orders/actions";
import { DELIVERY_CITIES, PAYMENT_METHODS, formatPrice } from "@/lib/constants";
import type { PaymentMethod } from "@/types";
import type { PaymentConfig } from "@/lib/settings";
import { Tag } from "lucide-react";

const inputCls =
  "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-sky-500";

const METHOD_ENABLED: Record<PaymentMethod, keyof PaymentConfig> = {
  mtn_momo: "momoEnabled",
  orange_money: "orangeEnabled",
  cash_on_delivery: "codEnabled",
};

export function CheckoutForm({ payments }: { payments: PaymentConfig }) {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [city, setCity] = useState("Douala");
  const [payment, setPayment] = useState<PaymentMethod>("cash_on_delivery");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Code promo
  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState<{ code: string; percent: number } | null>(
    null
  );
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);

  const enabledMethods = PAYMENT_METHODS.filter(
    (m) => payments[METHOD_ENABLED[m.id]]
  );

  const deliveryFee = DELIVERY_CITIES[city] ?? 0;
  const discount = promo ? Math.round((total * promo.percent) / 100) : 0;
  const grandTotal = total - discount + deliveryFee;

  async function applyPromo() {
    setPromoError("");
    setPromoLoading(true);
    try {
      const res = await checkPromo(promoInput);
      if ("error" in res && res.error) {
        setPromo(null);
        setPromoError(res.error);
      } else if (res.ok) {
        setPromo({ code: res.code, percent: res.percent });
      }
    } finally {
      setPromoLoading(false);
    }
  }

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
        promoCode: promo?.code,
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
            {enabledMethods.map((m) => (
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
          {payments.momoEnabled && payments.momoNumber && (
            <p className="mt-3 text-xs text-muted-foreground">
              MTN MoMo : {payments.momoNumber} — {payments.momoInstructions}
            </p>
          )}
          {payments.orangeEnabled && payments.orangeNumber && (
            <p className="mt-1.5 text-xs text-muted-foreground">
              Orange Money : {payments.orangeNumber} —{" "}
              {payments.orangeInstructions}
            </p>
          )}
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
        {/* Code promo */}
        <div className="mb-4 border-t pt-4">
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
            <Tag className="h-3.5 w-3.5" /> Code promo
          </label>
          <div className="flex gap-2">
            <input
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
              placeholder="EX : BIENVENUE10"
              className={`${inputCls} flex-1 uppercase`}
              disabled={!!promo}
            />
            {promo ? (
              <button
                type="button"
                onClick={() => {
                  setPromo(null);
                  setPromoInput("");
                }}
                className="rounded-md border px-3 text-xs font-medium hover:bg-sky-50"
              >
                Retirer
              </button>
            ) : (
              <button
                type="button"
                onClick={applyPromo}
                disabled={promoLoading || !promoInput.trim()}
                className="rounded-md bg-navy-900 px-3 text-xs font-medium text-white hover:bg-navy-700 disabled:opacity-50"
              >
                {promoLoading ? "…" : "Appliquer"}
              </button>
            )}
          </div>
          {promo && (
            <p className="mt-1.5 text-xs font-medium text-stock-in">
              Code {promo.code} appliqué : -{promo.percent}%
            </p>
          )}
          {promoError && (
            <p className="mt-1.5 text-xs text-red-600">{promoError}</p>
          )}
        </div>

        <dl className="space-y-2 border-t pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Sous-total</dt>
            <dd className="font-medium">{formatPrice(total)}</dd>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-cta-600">
              <dt>Remise ({promo?.code})</dt>
              <dd>-{formatPrice(discount)}</dd>
            </div>
          )}
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
