"use client";

import { SkeletonImage } from "@/components/ui/skeleton-image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";
import { toast } from "@/components/ui/toast";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { priceLabel } from "@/lib/constants";

export function WishlistView() {
  const { items, remove, clear } = useWishlist();
  const { addItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
        <Heart className="h-14 w-14 text-muted-foreground/40" />
        <div>
          <h2 className="text-lg font-semibold text-navy-900">
            Aucun favori pour le moment
          </h2>
          <p className="text-sm text-muted-foreground">
            Touchez le cœur sur un article pour le retrouver ici.
          </p>
        </div>
        <Link
          href="/boutique"
          className={cn(
            buttonVariants({ variant: "default" }),
            "bg-cta-500 text-white hover:bg-cta-600"
          )}
        >
          Voir la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {items.length} article{items.length > 1 ? "s" : ""} en favoris
        </p>
        <button
          onClick={clear}
          className="text-sm text-muted-foreground underline-offset-2 hover:text-destructive hover:underline"
        >
          Tout retirer
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const price = item.promoPrice ?? item.price;
          const hasPromo =
            item.promoPrice != null && item.promoPrice < item.price;
          return (
            <div
              key={item.productId}
              className="flex items-center gap-3 rounded-lg border bg-card p-3"
            >
              <Link
                href={`/produit/${item.slug}`}
                className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-sky-50"
              >
                {item.image ? (
                  <SkeletonImage
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-sky-600">
                    Photo
                  </div>
                )}
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/produit/${item.slug}`}
                  className="line-clamp-2 text-sm font-medium text-foreground hover:text-navy-900"
                >
                  {item.name}
                </Link>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-sm font-bold text-navy-900">
                    {priceLabel(price)}
                  </span>
                  {hasPromo && (
                    <span className="text-xs text-muted-foreground line-through">
                      {priceLabel(item.price)}
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      addItem({
                        productId: item.productId,
                        slug: item.slug,
                        name: item.name,
                        price,
                        quantity: 1,
                        image: item.image,
                      });
                      toast.add({
                        title: "Ajouté au panier",
                        description: item.name,
                        type: "success",
                      });
                    }}
                    className="flex items-center gap-1.5 rounded-md bg-cta-500 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-cta-600"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    Panier
                  </button>
                  <button
                    onClick={() => remove(item.productId)}
                    aria-label="Retirer des favoris"
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
