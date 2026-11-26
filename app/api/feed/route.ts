import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products, categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getBaseUrl } from "@/lib/site";
import { SITE_NAME } from "@/lib/constants";

// GET /api/feed — flux catalogue au format Meta Commerce (CSV).
// Gratuit, sans API payante : Meta Commerce récupère cette URL périodiquement
// et synchronise les produits vers WhatsApp Business, la boutique Facebook
// et Instagram Shopping.
export const dynamic = "force-dynamic";

const AVAILABILITY: Record<string, string> = {
  in_stock: "in stock",
  on_order: "available for order",
  out_of_stock: "out of stock",
};

function csv(v: string | number): string {
  return `"${String(v).replace(/"/g, '""')}"`;
}

export async function GET() {
  const rows = await db
    .select({
      name: products.name,
      reference: products.reference,
      description: products.description,
      price: products.price,
      promoPrice: products.promoPrice,
      status: products.status,
      slug: products.slug,
      images: products.images,
      categoryName: categories.name,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id));

  const base = getBaseUrl();

  const header = [
    "id",
    "title",
    "description",
    "availability",
    "condition",
    "price",
    "sale_price",
    "link",
    "image_link",
    "additional_image_link",
    "brand",
    "product_type",
  ];

  const lines = rows
    .map((p) => {
      const images = (p.images ?? [])
        .filter(Boolean)
        .map((img) => (img.startsWith("http") ? img : `${base}${img}`));
      // image_link est obligatoire chez Meta : on ignore les articles sans photo.
      if (!images[0]) return null;
      return [
        p.reference,
        p.name.slice(0, 150),
        (p.description || p.name).replace(/\s+/g, " ").trim(),
        AVAILABILITY[p.status] ?? "in stock",
        "new",
        `${p.price} XAF`,
        p.promoPrice && p.promoPrice < p.price ? `${p.promoPrice} XAF` : "",
        `${base}/produit/${p.slug}`,
        images[0],
        images.slice(1, 11).join(","),
        SITE_NAME,
        p.categoryName ?? "",
      ]
        .map(csv)
        .join(",");
    })
    .filter((l): l is string => l !== null);

  const body = [header.map(csv).join(","), ...lines].join("\n");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate",
    },
  });
}
