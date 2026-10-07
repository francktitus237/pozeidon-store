import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, SearchX } from "lucide-react";
import { getProducts } from "@/features/products/queries";
import { ProductCard } from "@/components/shop/product-card";
import { CATEGORIES } from "@/lib/constants";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ categorie: string }>;
  searchParams: Promise<{ tri?: string; dispo?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorie } = await params;
  const cat = CATEGORIES.find((c) => c.slug === categorie);
  return { title: `${cat?.name ?? "Catégorie"} — Pozeidon Engineering` };
}

const SORTS = [
  { key: "", label: "Pertinence" },
  { key: "prix_asc", label: "Prix croissant" },
  { key: "prix_desc", label: "Prix décroissant" },
  { key: "nom", label: "Nom A–Z" },
];

export default async function CategoryPage({ params, searchParams }: Props) {
  const { categorie } = await params;
  const { tri = "", dispo = "" } = await searchParams;

  const category = CATEGORIES.find((c) => c.slug === categorie);
  if (!category) notFound();

  const all = await getProducts();
  let items = all.filter((p) => p.categoryId === categorie);

  // Filtre disponibilité
  if (dispo === "stock") items = items.filter((p) => p.status === "in_stock" && p.stock > 0);

  // Tri
  if (tri === "prix_asc")
    items = [...items].sort((a, b) => (a.promoPrice ?? a.price) - (b.promoPrice ?? b.price));
  else if (tri === "prix_desc")
    items = [...items].sort((a, b) => (b.promoPrice ?? b.price) - (a.promoPrice ?? a.price));
  else if (tri === "nom")
    items = [...items].sort((a, b) => a.name.localeCompare(b.name, "fr"));

  const link = (t: string, d: string) =>
    `/boutique/${categorie}${t || d ? `?${new URLSearchParams({ ...(t ? { tri: t } : {}), ...(d ? { dispo: d } : {}) })}` : ""}`;

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Fil d'Ariane */}
      <nav className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-navy-900">Accueil</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/boutique" className="hover:text-navy-900">Boutique</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-navy-900">{category.name}</span>
      </nav>

      <h1 className="text-2xl font-bold text-navy-900">{category.name}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {items.length} article(s)
      </p>

      {/* Barre de filtres */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        {/* Tri */}
        <div className="flex flex-wrap items-center gap-1.5">
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
        </div>

        {/* Disponibilité */}
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

      {/* Navigation entre catégories */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        <Link
          href="/boutique"
          className="rounded-full bg-sky-50 px-3 py-1 text-xs text-sky-700 hover:bg-sky-100"
        >
          Tout
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/boutique/${c.slug}`}
            className={`rounded-full px-3 py-1 text-xs transition ${
              c.slug === categorie
                ? "bg-navy-900 font-medium text-white"
                : "bg-sky-50 text-sky-700 hover:bg-sky-100"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {/* Grille */}
      {items.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 py-10 text-center">
          <SearchX className="h-12 w-12 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            Aucun article ne correspond à ces filtres.
          </p>
          <Link
            href={`/boutique/${categorie}`}
            className="text-sm font-medium text-sky-600 hover:underline"
          >
            Réinitialiser les filtres
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
