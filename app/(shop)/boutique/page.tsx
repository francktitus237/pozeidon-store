import Link from "next/link";
import { getCategories, getProducts } from "@/features/products/queries";
import { ProductCard } from "@/components/shop/product-card";
import { SearchX } from "lucide-react";

export const metadata = { title: "Boutique — Pozeidon Engineering" };
export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ q?: string; tri?: string; dispo?: string }>;
}

const SORTS = [
  { key: "", label: "Pertinence" },
  { key: "prix_asc", label: "Prix croissant" },
  { key: "prix_desc", label: "Prix décroissant" },
  { key: "nom", label: "Nom A–Z" },
];

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
  const { q, tri = "", dispo = "" } = await searchParams;
  const query = q?.trim() ?? "";
  const [all, categories] = await Promise.all([getProducts(), getCategories()]);
  let products = query ? all.filter((p) => matchesQuery(p, query)) : [...all];

  if (dispo === "stock")
    products = products.filter((p) => p.status === "in_stock" && p.stock > 0);
  if (tri === "prix_asc")
    products.sort((a, b) => (a.promoPrice ?? a.price) - (b.promoPrice ?? b.price));
  else if (tri === "prix_desc")
    products.sort((a, b) => (b.promoPrice ?? b.price) - (a.promoPrice ?? a.price));
  else if (tri === "nom")
    products.sort((a, b) => a.name.localeCompare(b.name, "fr"));

  const link = (t: string, d: string) => {
    const p = new URLSearchParams();
    if (query) p.set("q", query);
    if (t) p.set("tri", t);
    if (d) p.set("dispo", d);
    const s = p.toString();
    return `/boutique${s ? `?${s}` : ""}`;
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-navy-900">
        {query ? `Résultats pour « ${query} »` : "Toute la boutique"}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {products.length} article(s)
        {query
          ? ` correspondant à votre recherche`
          : " — ordinateurs, accessoires Starlink & informatique, services"}
      </p>

      {/* Catégories */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        <Link
          href="/boutique"
          className="rounded-full bg-navy-900 px-3 py-1 text-xs font-medium text-white"
        >
          Tout
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/boutique/${c.slug}`}
            className="rounded-full bg-sky-50 px-3 py-1 text-xs text-sky-700 transition hover:bg-sky-100"
          >
            {c.name}
          </Link>
        ))}
      </div>

      {/* Tri + disponibilité */}
      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Trier :
        </span>
        {SORTS.map((s) => (
          <Link
            key={s.key}
            href={link(s.key, dispo)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              tri === s.key
                ? "border-navy-900 bg-navy-900 text-white"
                : "hover:border-sky-400 hover:text-navy-900"
            }`}
          >
            {s.label}
          </Link>
        ))}
        <Link
          href={link(tri, dispo === "stock" ? "" : "stock")}
          className={`ml-auto rounded-full border px-3 py-1 text-xs font-medium transition ${
            dispo === "stock"
              ? "border-stock-in bg-stock-in/10 text-stock-in"
              : "hover:border-sky-400 hover:text-navy-900"
          }`}
        >
          En stock uniquement
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 py-10 text-center">
          <SearchX className="h-12 w-12 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            Aucun article ne correspond à ces filtres.
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
