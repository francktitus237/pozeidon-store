import { db } from "@/lib/db";
import { promoCodes } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import type { Metadata } from "next";
import { PromoManager } from "@/components/admin/promo-manager";

export const metadata: Metadata = { title: "Codes promo — Admin" };
export const dynamic = "force-dynamic";

export default async function PromosPage() {
  const rows = await db
    .select()
    .from(promoCodes)
    .orderBy(desc(promoCodes.createdAt));

  return (
    <div className="p-6">
      <h1 className="mb-1 text-2xl font-bold text-navy-900">Codes promo</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Remises en pourcentage appliquées au sous-total lors de la commande.
      </p>
      <PromoManager rows={rows} />
    </div>
  );
}
