// Requêtes produits côté serveur — la base de données est la seule source.
// Les résultats sont mis en cache (unstable_cache) pour des navigations
// instantanées ; les actions admin invalident via revalidateTag().

import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import type { Product } from "@/types";
import { CATEGORIES } from "@/lib/constants";

function toProduct(row: typeof products.$inferSelect): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    reference: row.reference,
    description: row.description ?? undefined,
    price: row.price,
    promoPrice: row.promoPrice ?? undefined,
    stock: row.stock,
    status: row.status as Product["status"],
    categoryId: row.categoryId,
    // Dedup : aucune image ne s'affiche en double
    images: [...new Set(row.images as string[])],
    installationAvailable: row.installationAvailable,
    createdAt: row.createdAt.toISOString(),
  };
}

const getProductsCached = unstable_cache(
  async (): Promise<Product[]> => {
    try {
      const rows = await db.select().from(products);
      return rows.map(toProduct);
    } catch {
      return [];
    }
  },
  ["products-all"],
  { tags: ["products"], revalidate: 60 }
);

export function getProducts(): Promise<Product[]> {
  return getProductsCached();
}

export async function getFlashProducts(): Promise<Product[]> {
  const all = await getProducts();
  // Vente flash = uniquement les vraies promos (prix promo renseigné).
  // Aucune promo → [] : la section n'apparaît pas sur l'accueil.
  return all.filter((p) => p.promoPrice != null).slice(0, 4);
}

const getProductBySlugCached = unstable_cache(
  async (slug: string): Promise<Product | null> => {
    try {
      const [row] = await db
        .select()
        .from(products)
        .where(eq(products.slug, slug));
      if (row) return toProduct(row);
      return null;
    } catch {
      return null;
    }
  },
  ["product-by-slug"],
  { tags: ["products"], revalidate: 60 }
);

export function getProductBySlug(slug: string): Promise<Product | null> {
  return getProductBySlugCached(slug);
}

/**
 * Catégories gérées dans l'admin (`/gestion/categories`).
 * Fallback sur les catégories par défaut si la table est vide/inaccessible,
 * pour que la boutique fonctionne toujours.
 */
// Ordre d'affichage : CATEGORIES canonique, les catégories créées en admin
// se placent avant « Promotions », qui reste toujours en dernier.
const CAT_ORDER = new Map<string, number>(
  CATEGORIES.map((c, i) => [c.slug, i] as [string, number])
);
function sortCategories<
  T extends { slug: string; name: string; image?: string | null },
>(list: T[]): T[] {
  return [...list].sort((a, b) => {
    const rank = (slug: string) =>
      slug === "promotions" ? 9999 : (CAT_ORDER.get(slug) ?? 500);
    return rank(a.slug) - rank(b.slug);
  });
}

const getCategoriesCached = unstable_cache(
  async (): Promise<
    { slug: string; name: string; image?: string | null }[]
  > => {
    try {
      const rows = await db.select().from(categories);
      if (rows.length === 0) return [...CATEGORIES];
      return sortCategories(rows);
    } catch {
      return [...CATEGORIES];
    }
  },
  ["categories-all"],
  { tags: ["categories"], revalidate: 60 }
);

export function getCategories(): Promise<
  { slug: string; name: string; image?: string | null }[]
> {
  return getCategoriesCached();
}
