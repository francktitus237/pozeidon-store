import { db } from "@/lib/db";
import { products, stockAlerts } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { toIso } from "@/lib/dates";

export interface StockAlertRow {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productStatus: string;
  phone: string;
  email: string | null;
  notifiedAt: string | null;
  createdAt: string;
}

export async function getStockAlerts(): Promise<StockAlertRow[]> {
  try {
    const rows = await db
      .select({
        id: stockAlerts.id,
        productId: stockAlerts.productId,
        productName: products.name,
        productSlug: products.slug,
        productStatus: products.status,
        phone: stockAlerts.phone,
        email: stockAlerts.email,
        notifiedAt: stockAlerts.notifiedAt,
        createdAt: stockAlerts.createdAt,
      })
      .from(stockAlerts)
      .leftJoin(products, eq(stockAlerts.productId, products.id))
      .orderBy(desc(stockAlerts.createdAt));
    return rows.map((r) => ({
      ...r,
      productName: r.productName ?? "Article supprimé",
      productSlug: r.productSlug ?? "",
      productStatus: r.productStatus ?? "out_of_stock",
      notifiedAt: r.notifiedAt ? toIso(r.notifiedAt) : null,
      createdAt: toIso(r.createdAt),
    }));
  } catch {
    return [];
  }
}
