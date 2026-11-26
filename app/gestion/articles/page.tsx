export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";
import { getAiConfig, getSocialConfig } from "@/lib/settings";
import { ProductManager } from "@/components/admin/product-manager";

export default async function AdminArticlesPage() {
  const [rows, cats, social, aiCfg] = await Promise.all([
    db.select().from(products),
    db.select().from(categories),
    getSocialConfig(),
    getAiConfig(),
  ]);

  // N'affiche une case « Publier sur… » que pour les réseaux vraiment connectés.
  const shareable = {
    facebook:
      social.facebookEnabled &&
      !!social.metaAccessToken &&
      !!social.facebookPageId,
    instagram:
      social.instagramEnabled &&
      !!social.metaAccessToken &&
      !!social.instagramUserId,
  };

  return (
    <ProductManager
      rows={rows}
      categories={cats.map((c) => ({ id: c.id, name: c.name }))}
      social={shareable}
      ai={!!aiCfg.geminiApiKey}
    />
  );
}
