// Seed du catalogue produits — appelé automatiquement par lib/init-db.ts
// au démarrage (prod) et manuellement via /api/admin/seed-catalog.
// Idempotent : les images sont insérées ON CONFLICT DO NOTHING dans la
// table files (base64 → servies par /uploads/[name]) et les produits dont
// la référence existe déjà sont ignorés.

import { readFileSync, existsSync } from "fs";
import path from "path";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { files, products } from "@/lib/db/schema";
import { SEED_PRODUCTS } from "./seed-catalog";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export interface SeedResult {
  inserted: number;
  skipped: number;
  images: number;
  total: number;
}

export async function seedCatalog(): Promise<SeedResult> {
  const imagesDir = path.join(process.cwd(), "public", "images", "products");
  let inserted = 0;
  let skipped = 0;
  let images = 0;

  for (const [i, p] of SEED_PRODUCTS.entries()) {
    // 1) Image : fichier public/ → table files (base64), servie via /uploads/
    let imageSrc: string | null = null;
    const imgName = p.image.split("/").pop() ?? "";
    const imgPath = imgName ? path.join(imagesDir, imgName) : "";
    if (imgName && existsSync(imgPath)) {
      const buf = readFileSync(imgPath);
      await db
        .insert(files)
        .values({ id: imgName, mime: "image/jpeg", data: buf.toString("base64") })
        .onConflictDoNothing();
      images++;
      imageSrc = `/uploads/${imgName}`;
    }

    // 2) Produit : ignoré si la référence existe déjà
    const existing = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.reference, p.reference))
      .limit(1);
    if (existing.length > 0) {
      skipped++;
      continue;
    }

    const id = `seed-glt-${String(i + 1).padStart(3, "0")}`;
    await db.insert(products).values({
      id,
      slug: `${slugify(p.name)}-${id}`,
      name: p.name,
      reference: p.reference,
      description: p.description,
      price: p.price,
      promoPrice: p.promoPrice ?? null,
      stock: p.stock,
      status: "in_stock",
      categoryId: p.categoryId,
      images: imageSrc ? [imageSrc] : [],
      videoUrl: null,
      installationAvailable: false,
    });
    inserted++;
  }

  return { inserted, skipped, images, total: SEED_PRODUCTS.length };
}
