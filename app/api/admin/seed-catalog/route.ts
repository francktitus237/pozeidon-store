import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { SEED_PRODUCTS } from "@/lib/seed-catalog";

// GET /api/admin/seed-catalog — insère le catalogue Glotelho en base.
// Réservé aux admins connectés. Idempotent : un produit dont la référence
// existe déjà est ignoré (on peut rappeler l'URL sans créer de doublons).
function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    let inserted = 0;
    const skipped: string[] = [];

    for (const [i, p] of SEED_PRODUCTS.entries()) {
      const existing = await db
        .select({ id: products.id })
        .from(products)
        .where(eq(products.reference, p.reference))
        .limit(1);
      if (existing.length > 0) {
        skipped.push(p.reference);
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
        images: [p.image],
        videoUrl: null,
        installationAvailable: false,
      });
      inserted++;
    }

    return NextResponse.json({
      ok: true,
      inserted,
      skipped: skipped.length,
      skippedRefs: skipped,
      total: SEED_PRODUCTS.length,
    });
  } catch (error) {
    console.error("[seed-catalog] error", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
