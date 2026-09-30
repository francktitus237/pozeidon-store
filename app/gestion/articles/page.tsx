import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";
import { ProductManager } from "@/components/admin/product-manager";

export default async function AdminArticlesPage() {
  const [rows, cats] = await Promise.all([
    db.select().from(products),
    db.select().from(categories),
  ]);

  return (
    <ProductManager
      rows={rows}
      categories={cats.map((c) => ({ id: c.id, name: c.name }))}
    />
  );
}
