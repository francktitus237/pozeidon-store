"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag, Truck } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { DELIVERY_CITIES, formatPrice } from "@/lib/constants";

export function CartView() {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();
  const [city, setCity] = useState<string>("Douala");

  const deliveryFee = DELIVERY_CITIES[city] ?? 0;
  const grandTotal = total + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
        <ShoppingBag className="h-14 w-14 text-muted-foreground/40" />
        <div>
          <h2 className="text-lg font-semibold text-navy-900">
            Votre panier est vide
          </h2>
          <p className="text-sm text-muted-foreground">
            Parcourez la boutique pour ajouter des articles.
          </p>
        </div>
        <Button
          nativeButton={false}
          render={<Link href="/boutique" />}
          className="bg-cta-500 hover:bg-cta-600"
        >
          Voir la boutique
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      {/* Lignes */}
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-4 rounded-lg border bg-card p-3"
          >
            <Link
              href={`/produit/${item.slug}`}
              className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-sky-50"
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain"
                />
              ) : (
                <ShoppingBag className="absolute inset-0 m-auto h-6 w-6 text-muted-foreground/40" />
              )}
            </Link>

            <div className="min-w-0 flex-1">
              <Link
                href={`/produit/${item.slug}`}
                className="line-clamp-2 text-sm font-medium hover:text-navy-900"
              >
                {item.name}
              </Link>
              <p className="mt-1 text-sm font-bold text-navy-900">
                {formatPrice(item.price)}
              </p>
              {item.withInstallation && (
                <p className="text-xs text-sky-600">+ installation incluse</p>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  updateQuantity(item.productId, item.quantity - 1)
                }
                disabled={item.quantity <= 1}
                className="rounded-md border p-1.5 hover:bg-sky-50 disabled:opacity-40"
                aria-label="Diminuer"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-semibold">
                {item.quantity}
              </span>
              <button
                onClick={() =>
                  updateQuantity(item.productId, item.quantity + 1)
                }
                className="rounded-md border p-1.5 hover:bg-sky-50"
                aria-label="Augmenter"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            <p className="hidden w-28 text-right text-sm font-semibold sm:block">
              {formatPrice(item.price * item.quantity)}
            </p>

            <button
              onClick={() => removeItem(item.productId)}
              className="rounded-md p-2 text-muted-foreground hover:bg-red-50 hover:text-red-600"
              aria-label="Retirer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        <button
          onClick={clearCart}
          className="self-end text-xs text-muted-foreground underline-offset-2 hover:text-red-600 hover:underline"
        >
          Vider le panier
        </button>
      </div>

      {/* Récapitulatif */}
      <aside className="h-fit rounded-lg border bg-card p-5 lg:sticky lg:top-24">
        <h2 className="mb-4 font-semibold text-navy-900">Récapitulatif</h2>

        <div className="mb-4">
          <label
            htmlFor="city"
            className="mb-1.5 flex items-center gap-1.5 text-sm font-medium"
          >
            <Truck className="h-4 w-4 text-sky-600" /> Ville de livraison
          </label>
          <select
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-sky-500"
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

        <Button
          nativeButton={false}
          render={<Link href="/commande" />}
          className="mt-5 w-full bg-cta-500 hover:bg-cta-600"
          size="lg"
        >
          Passer commande
        </Button>
        <Link
          href="/boutique"
          className="mt-3 block text-center text-sm text-sky-600 hover:underline"
        >
          Continuer mes achats
        </Link>

        <p className="mt-4 text-xs text-muted-foreground">
          Paiement MTN MoMo, Orange Money ou à la livraison.
        </p>
      </aside>
    </div>
  );
}
