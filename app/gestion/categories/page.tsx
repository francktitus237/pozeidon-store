import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import type { Metadata } from "next";
import { CategoryManager } from "@/components/admin/category-manager";

export const metadata: Metadata = { title: "Catégories — Admin" };
export const dynamic = "force-dynamic";

export default async function CategoriesAdminPage() {
  const rows = await db.select().from(categories);

  return (
    <div className="p-6">
      <h1 className="mb-1 text-2xl font-bold text-navy-900">Catégories</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Les catégories créées ici apparaissent dans la boutique, le menu et le
        formulaire d'articles.
      </p>
      <CategoryManager rows={rows} />
    </div>
  );
}
