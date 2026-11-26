import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ProductActions } from "@/components/shop/product-actions";
import { WishlistButton } from "@/components/shop/wishlist-button";
import { ProductCard } from "@/components/shop/product-card";
import { StockAlertForm } from "@/components/shop/stock-alert-form";
import { Reveal } from "@/components/reveal";
import { ProductReviews } from "@/components/shop/product-reviews";
import { RecentlyViewed } from "@/components/shop/recently-viewed";
import { getApprovedReviews, reviewStats } from "@/features/reviews/queries";
import { ProductGallery } from "@/components/shop/product-gallery";
import { getProductBySlug, getProducts } from "@/features/products/queries";
import { getContact, getTariffs } from "@/lib/settings";
import { priceLabel, SITE_NAME } from "@/lib/constants";
import { getBaseUrl } from "@/lib/site";
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
  const base = getBaseUrl();
  const image = product.images[0] ? `${base}${product.images[0]}` : `${base}/logo-mark.png`;
  return {
    title: product.name,
    description: product.description ?? `Achetez ${product.name} chez Pozeidon Engineering SARL.`,
    openGraph: {
      title: product.name,
      description: product.description ?? undefined,
      images: [image],
    },
    twitter: { card: "summary_large_image", images: [image] },
  };
}

function isNew(createdAt: string, days = 14) {
  return Date.now() - new Date(createdAt).getTime() < days * 24 * 3600 * 1000;
}

function youtubeId(url: string): string | null {
  const m =
    url.match(/youtube\.com\/watch\?v=([\w-]{11})/) ??
    url.match(/youtu\.be\/([\w-]{11})/) ??
    url.match(/youtube\.com\/embed\/([\w-]{11})/);
  return m ? m[1] : null;
}

const STOCK_LABEL = {
  in_stock: { text: "En stock", className: "text-stock-in" },
  on_order: { text: "Sur commande", className: "text-stock-order" },
  out_of_stock: { text: "Épuisé", className: "text-stock-out" },
} as const;

const SCHEMA_AVAILABILITY = {
  in_stock: "https://schema.org/InStock",
  on_order: "https://schema.org/PreOrder",
  out_of_stock: "https://schema.org/OutOfStock",
} as const;

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [product, contact, tariffs] = await Promise.all([
    getProductBySlug(slug),
    getContact(),
    getTariffs(),
  ]);
  if (!product) notFound();
  const productReviews = await getApprovedReviews(product.id);
  const stats = reviewStats(productReviews);

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
  const similar = (await getProducts())
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const base = getBaseUrl();
  const absImages = product.images
    .filter(Boolean)
    .map((img) => (img.startsWith("http") ? img : `${base}${img}`));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.reference,
    description: product.description ?? undefined,
    image: absImages.length ? absImages : undefined,
    brand: { "@type": "Brand", name: SITE_NAME },
    ...(stats.count > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: stats.average,
        reviewCount: stats.count,
      },
      review: productReviews.slice(0, 5).map((r) => ({
        "@type": "Review",
        author: { "@type": "Person", name: r.name },
        reviewRating: { "@type": "Rating", ratingValue: r.rating },
        reviewBody: r.text,
      })),
    }),
    offers: {
      "@type": "Offer",
      url: `${base}/produit/${product.slug}`,
      priceCurrency: "XAF",
      price: hasPromo ? product.promoPrice : product.price,
      availability: SCHEMA_AVAILABILITY[product.status],
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-navy-900">Accueil</Link>
        {" / "}
        <Link href="/boutique" className="hover:text-navy-900">Boutique</Link>
        {" / "}
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative">
          <ProductGallery images={product.images} alt={product.name} />
          <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
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
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl">
              <Badge className="bg-destructive text-white hover:bg-destructive">
                Épuisé
              </Badge>
            </div>
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
                {priceLabel(product.price)}
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

          {isOut && <StockAlertForm productId={product.id} />}

          <div className="flex items-start gap-2">
            <div className="flex-1">
              <ProductActions
                product={product}
                whatsapp={contact.whatsapp}
                installOptions={tariffs.installation}
              />
            </div>
            <WishlistButton
              product={product}
              className="mt-1 rounded-full border bg-white p-2.5 shadow-sm transition-colors hover:bg-sky-50"
            />
          </div>
        </div>
      </div>

      {product.videoUrl && (
        <section className="mt-10">
          <h2 className="mb-3 text-xl font-bold text-navy-900">
            Vidéo du produit
          </h2>
          {youtubeId(product.videoUrl) ? (
            <div className="aspect-video w-full overflow-hidden rounded-xl md:max-w-3xl">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId(product.videoUrl)}`}
                title={`Vidéo — ${product.name}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          ) : (
            <video
              src={product.videoUrl}
              controls
              preload="metadata"
              className="aspect-video w-full rounded-xl bg-black md:max-w-3xl"
            />
          )}
        </section>
      )}

      <ProductReviews productId={product.id} reviews={productReviews} />

      {similar.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-4 text-xl font-bold text-navy-900">
            Produits similaires
          </h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {similar.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 60}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <RecentlyViewed product={product} />
    </main>
  );
}
