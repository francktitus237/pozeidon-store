import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ProductActions } from "@/components/shop/product-actions";
import { ProductCard } from "@/components/shop/product-card";
import { getProductBySlug, getProducts } from "@/features/products/queries";
import { formatPrice, priceLabel } from "@/lib/constants";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Produit introuvable" };
  return { title: product.name, description: product.description };
}

const STOCK_LABEL = {
  in_stock: { text: "En stock", className: "text-stock-in" },
  on_order: { text: "Sur commande", className: "text-stock-order" },
  out_of_stock: { text: "Épuisé", className: "text-stock-out" },
} as const;

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const hasPromo =
    product.promoPrice !== undefined && product.price > 0;
  const discount = hasPromo
    ? Math.round((1 - product.promoPrice! / product.price) * 100)
    : 0;
  const stock = STOCK_LABEL[product.status];
  const similar = (await getProducts())
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  return (
    <main className="container mx-auto px-4 py-8">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-navy-900">Accueil</Link>
        {" / "}
        <Link href="/boutique" className="hover:text-navy-900">Boutique</Link>
        {" / "}
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-sky-50">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sky-600">
              Photo article
            </div>
          )}
          {hasPromo && (
            <Badge className="absolute left-3 top-3 bg-cta-500 text-white hover:bg-cta-500">
              -{discount}%
            </Badge>
          )}
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Réf. {product.reference}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-navy-900 md:text-3xl">
              {product.name}
            </h1>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-navy-900">
              {priceLabel(product.promoPrice ?? product.price)}
            </span>
            {hasPromo && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <p className={`text-sm font-medium ${stock.className}`}>
            ● {stock.text}
            {product.stock > 0 && product.status === "in_stock" && (
              <span className="text-muted-foreground">
                {" "}
                ({product.stock} dispo)
              </span>
            )}
          </p>

          {product.description && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          )}

          <ProductActions product={product} />
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-4 text-xl font-bold text-navy-900">
            Produits similaires
          </h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {similar.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
