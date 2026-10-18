import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/site";
import { getCategories, getProducts } from "@/features/products/queries";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getBaseUrl();
  const now = new Date().toISOString();

  const staticRoutes = [
    "/",
    "/boutique",
    "/services",
    "/installation",
    "/entreprises",
    "/contact",
    "/conseils",
    "/mentions-legales",
    "/cgv",
    "/politique-confidentialite",
    "/livraison-retours",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
  }));

  let dynamicRoutes: MetadataRoute.Sitemap = [];
  try {
    const [categories, products] = await Promise.all([
      getCategories(),
      getProducts(),
    ]);
    dynamicRoutes = [
      ...categories.map((c) => ({
        url: `${base}/boutique/${c.slug}`,
        lastModified: now,
      })),
      ...products.map((p) => ({
        url: `${base}/produit/${p.slug}`,
        lastModified: now,
      })),
    ];
  } catch {
    // En cas d'indisponibilité DB, on sert au moins les routes statiques.
  }

  return [...staticRoutes, ...dynamicRoutes];
}
