import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ProductActions } from "@/components/shop/product-actions";
import { ProductCard } from "@/components/shop/product-card";
import { ProductGallery } from "@/components/shop/product-gallery";
import { getProductBySlug, getProducts } from "@/features/products/queries";
import { getContact, getTariffs } from "@/lib/settings";
import { priceLabel } from "@/lib/constants";
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

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [product, contact, tariffs] = await Promise.all([
    getProductBySlug(slug),
    getContact(),
    getTariffs(),
  ]);
  if (!product) notFound();

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

          <ProductActions
                  product={product}
                  whatsapp={contact.whatsapp}
                  installOptions={tariffs.installation}
                />
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
