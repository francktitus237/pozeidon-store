import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { priceLabel } from "@/lib/constants";
import type { Product } from "@/types";

const STOCK_LABEL = {
  in_stock: { text: "En stock", className: "text-stock-in" },
  on_order: { text: "Sur commande", className: "text-stock-order" },
  out_of_stock: { text: "Épuisé", className: "text-stock-out" },
} as const;

function isNew(createdAt: string, days = 14) {
  return (
    Date.now() - new Date(createdAt).getTime() < days * 24 * 3600 * 1000
  );
}

export function ProductCard({ product }: { product: Product }) {
  const hasPromo =
    product.promoPrice != null &&
    product.promoPrice > 0 &&
    product.promoPrice < product.price;
  const discount = hasPromo
    ? Math.round((1 - product.promoPrice! / product.price) * 100)
    : 0;
  const stock = STOCK_LABEL[product.status];
  const showNew = isNew(product.createdAt) && product.status !== "out_of_stock";
  const isOut = product.status === "out_of_stock";

  return (
    <Link href={`/produit/${product.slug}`} className="group block">
      <Card className="overflow-hidden border transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-md">
        <div className="relative aspect-square overflow-hidden bg-sky-50">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
                isOut ? "opacity-60 grayscale" : ""
              }`}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-sky-600">
              Photo article
            </div>
          )}
          <div className="absolute left-2 top-2 flex flex-col gap-1.5">
            {hasPromo && (
              <Badge className="bg-cta-500 text-white hover:bg-cta-500">
                -{discount}%
              </Badge>
            )}
            {showNew && (
              <Badge className="bg-navy-900 text-white hover:bg-navy-900">
                Nouveau
              </Badge>
            )}
          </div>
          {isOut && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Badge className="bg-destructive text-white hover:bg-destructive">
                Épuisé
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-3">
          <p className="line-clamp-2 min-h-10 text-sm font-medium text-foreground">
            {product.name}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-bold text-navy-900">
              {priceLabel(hasPromo ? product.promoPrice! : product.price)}
            </span>
            {hasPromo && (
              <span className="text-xs text-muted-foreground line-through">
                {priceLabel(product.price)}
              </span>
            )}
          </div>
          <p className={`mt-1 text-xs font-medium ${stock.className}`}>
            ● {stock.text}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
