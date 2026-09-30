import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/constants";
import type { Product } from "@/types";

const STOCK_LABEL = {
  in_stock: { text: "En stock", className: "text-stock-in" },
  on_order: { text: "Sur commande", className: "text-stock-order" },
  out_of_stock: { text: "Épuisé", className: "text-stock-out" },
} as const;

export function ProductCard({ product }: { product: Product }) {
  const hasPromo = product.promoPrice !== undefined;
  const discount = hasPromo
    ? Math.round((1 - product.promoPrice! / product.price) * 100)
    : 0;
  const stock = STOCK_LABEL[product.status];

  return (
    <Link href={`/produit/${product.slug}`} className="group block">
      <Card className="overflow-hidden border transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-md">
        <div className="relative aspect-square bg-sky-50">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-sky-600">
              Photo article
            </div>
          )}
          {hasPromo && (
            <Badge className="absolute left-2 top-2 bg-cta-500 text-white hover:bg-cta-500">
              -{discount}%
            </Badge>
          )}
        </div>
        <CardContent className="p-3">
          <p className="line-clamp-2 min-h-10 text-sm font-medium text-foreground">
            {product.name}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-base font-bold text-navy-900">
              {formatPrice(product.promoPrice ?? product.price)}
            </span>
            {hasPromo && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.price)}
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
