"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, MessageCircle, Minus, Plus } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { formatPrice, CONTACT, INSTALLATION_PRICES } from "@/lib/constants";
import type { Product } from "@/types";

export function ProductActions({ product }: { product: Product }) {
  const { addItem, toggleCart } = useCart();
  const [qty, setQty] = useState(1);
  const [withInstall, setWithInstall] = useState(false);
  const [installType, setInstallType] =
    useState<keyof typeof INSTALLATION_PRICES>("toiture_simple");

  const installPrice = withInstall ? (INSTALLATION_PRICES[installType] ?? 0) : 0;
  const unitPrice = (product.promoPrice ?? product.price) + (installPrice ?? 0);

  const waMessage = encodeURIComponent(
    `Bonjour, je souhaite commander :\n• ${qty}× ${product.name} (${formatPrice(unitPrice)}/u)` +
      (withInstall
        ? `\n• Installation : ${installType.replace(/_/g, " ")}`
        : "")
  );

  return (
    <div className="space-y-4">
      {product.installationAvailable && (
        <label className="flex items-center gap-3 rounded-lg border p-3 text-sm">
          <input
            type="checkbox"
            checked={withInstall}
            onChange={(e) => setWithInstall(e.target.checked)}
            className="h-4 w-4 accent-navy-900"
          />
          <span>
            Ajouter l&rsquo;installation par nos techniciens{" "}
            <span className="text-muted-foreground">(sur devis ou forfait)</span>
          </span>
        </label>
      )}

      {withInstall && (
        <select
          value={installType}
          onChange={(e) =>
            setInstallType(e.target.value as keyof typeof INSTALLATION_PRICES)
          }
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
        >
          <option value="toiture_simple">
            Toiture simple — {formatPrice(INSTALLATION_PRICES.toiture_simple)}
          </option>
          <option value="toiture_haute">
            Toiture haute — {formatPrice(INSTALLATION_PRICES.toiture_haute)}
          </option>
          <option value="pose_sur_mat">
            Pose sur mât — {formatPrice(INSTALLATION_PRICES.pose_sur_mat)}
          </option>
          <option value="site_professionnel">
            Site professionnel — sur devis
          </option>
        </select>
      )}

      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-lg border">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3 py-2"
            aria-label="Diminuer"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center font-medium">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="px-3 py-2"
            aria-label="Augmenter"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <span className="text-sm text-muted-foreground">
          Total :{" "}
          <strong className="text-navy-900">
            {formatPrice(unitPrice * qty)}
          </strong>
        </span>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          onClick={() => {
            addItem({
              productId: product.id,
              slug: product.slug,
              name: product.name,
              price: unitPrice,
              quantity: qty,
              image: product.images[0],
              withInstallation: withInstall,
            });
            toggleCart(true);
          }}
          disabled={product.status === "out_of_stock"}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-cta-500 px-5 py-3 font-semibold text-white transition hover:bg-cta-600 disabled:opacity-50"
        >
          <ShoppingCart className="h-5 w-5" />
          Ajouter au panier
        </button>
        <Link
          href={`https://wa.me/${CONTACT.whatsapp}?text=${waMessage}`}
          target="_blank"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-whatsapp-500 px-5 py-3 font-semibold text-white transition hover:opacity-90"
        >
          <MessageCircle className="h-5 w-5" />
          Commander sur WhatsApp
        </Link>
      </div>
    </div>
  );
}
