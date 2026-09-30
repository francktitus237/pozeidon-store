// Requêtes produits côté serveur (DB d'abord, fallback sur les données démo)

import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { Product } from "@/types";
import { DEMO_PRODUCTS } from "./data";

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
  return all.filter((p) => p.promoPrice != null);
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
