// Requêtes produits côté serveur (DB d'abord, fallback sur les données démo)

import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { Product } from "@/types";
import { DEMO_PRODUCTS, FLASH_PRODUCTS } from "./data";
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
    images: row.images as string[],
    installationAvailable: row.installationAvailable,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function getProducts(): Promise<Product[]> {
  try {
    const rows = await db.select().from(products);
    if (rows.length === 0) return DEMO_PRODUCTS;
    return rows.map(toProduct);
  } catch {
    // DB inaccessible : on reste sur les données de démo
    return DEMO_PRODUCTS;
  }
}

export async function getFlashProducts(): Promise<Product[]> {
  const all = await getProducts();
  const promos = all.filter((p) => p.promoPrice != null);
  if (promos.length > 0) return promos.slice(0, 4);
  // Pas de promo active : on met en avant la sélection par défaut
  const ids = new Set(FLASH_PRODUCTS.map((p) => p.id));
  const selection = all.filter((p) => ids.has(p.id));
  return selection.length > 0 ? selection : all.slice(0, 4);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const [row] = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug));
    if (row) return toProduct(row);
    return DEMO_PRODUCTS.find((p) => p.slug === slug) ?? null;
  } catch {
    return DEMO_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
}

/**
 * Catégories gérées dans l'admin (`/gestion/categories`).
 * Fallback sur les catégories par défaut si la table est vide/inaccessible,
 * pour que la boutique fonctionne toujours.
 */
export async function getCategories(): Promise<
  { slug: string; name: string; image?: string | null }[]
> {
  try {
    const rows = await db.select().from(categories);
    if (rows.length === 0) return [...CATEGORIES];
    return rows;
  } catch {
    return [...CATEGORIES];
  }
}
