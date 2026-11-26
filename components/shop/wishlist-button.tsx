"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/use-wishlist";
import type { Product } from "@/types";

interface WishlistButtonProps {
  product: Pick<
    Product,
    "id" | "slug" | "name" | "price" | "promoPrice" | "images"
  >;
  className?: string;
}

export function WishlistButton({ product, className }: WishlistButtonProps) {
  const { isWishlisted, toggle } = useWishlist();
  const active = isWishlisted(product.id);

  return (
    <button
      type="button"
      aria-label={active ? "Retirer des favoris" : "Ajouter aux favoris"}
      aria-pressed={active}
      title={active ? "Retirer des favoris" : "Ajouter aux favoris"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          promoPrice: product.promoPrice,
          image: product.images[0],
        });
      }}
      className={
        className ??
        "rounded-full bg-white/90 p-2 shadow-sm transition-colors hover:bg-white"
      }
    >
      <Heart
        className={`h-4 w-4 transition-colors ${
          active ? "fill-cta-500 text-cta-500" : "text-navy-900"
        }`}
      />
    </button>
  );
}
