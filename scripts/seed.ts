// Seed de la base SQLite locale : catégories + produits de démo
// Lancer avec : npx tsx scripts/seed.ts

import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";
import { CATEGORIES } from "@/lib/constants";
import { DEMO_PRODUCTS } from "@/features/products/data";

async function main() {
  // Idempotent : vide puis réinsère (dev uniquement)
  await db.delete(products);
  await db.delete(categories);

  await db.insert(categories).values(
    CATEGORIES.map((c) => ({
      id: c.slug,
      slug: c.slug,
      name: c.name,
      description: null,
      image: null,
    }))
  );

  await db.insert(products).values(
    DEMO_PRODUCTS.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      reference: p.reference,
      description: p.description ?? null,
      price: p.price,
      promoPrice: p.promoPrice ?? null,
      stock: p.stock,
      status: p.status,
      categoryId: p.categoryId,
      images: p.images,
      videoUrl: null,
      installationAvailable: p.installationAvailable,
    }))
  );

  console.log(
    `Seed OK : ${CATEGORIES.length} catégories, ${DEMO_PRODUCTS.length} produits`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
