import Link from "next/link";
import { getProducts } from "@/features/products/queries";
import { ProductCard } from "@/components/shop/product-card";
import { SearchX } from "lucide-react";

export const metadata = { title: "Boutique — Pozeidon Engineering" };

interface Props {
  searchParams: Promise<{ q?: string }>;
}

function matchesQuery(
  p: { name: string; description?: string; reference: string },
  q: string
) {
  const haystack = `${p.name} ${p.description ?? ""} ${p.reference}`.toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .every((word) => haystack.includes(word));
}

export default async function BoutiquePage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const all = await getProducts();
  const products = query ? all.filter((p) => matchesQuery(p, query)) : all;

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-navy-900">
        {query ? `Résultats pour « ${query} »` : "Toute la boutique"}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {products.length} article(s)
        {query ? ` correspondant à votre recherche` : " — accessoires et équipements Starlink"}
      </p>

      {products.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 py-10 text-center">
          <SearchX className="h-12 w-12 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            Aucun article ne correspond à « {query} ».
          </p>
          <Link
            href="/boutique"
            className="text-sm font-medium text-sky-600 hover:underline"
          >
            Voir toute la boutique
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
