// Publication d'articles sur les réseaux sociaux (Meta Graph API).
// Facebook : post photo sur la Page. Instagram : conteneur media + publish.
// Les appels ne partent que côté serveur (actions admin).

import { getBaseUrl } from "@/lib/site";
import { getSocialConfig } from "@/lib/settings";
import { SITE_NAME, priceLabel } from "@/lib/constants";

// Version de l'API Graph Meta — à monter si Meta la déprécie (~2 ans de vie).
const GRAPH = "https://graph.facebook.com/v22.0";

export type SocialNetwork = "facebook" | "instagram";

export interface SocialPublishResult {
  network: SocialNetwork;
  ok: boolean;
  error?: string;
}

export interface SocialProduct {
  name: string;
  slug: string;
  description: string | null;
  price: number;
  promoPrice: number | null;
  images: string[];
}

interface GraphError {
  error?: { message?: string };
}

async function graphPost(
  path: string,
  params: Record<string, string>
): Promise<{ id?: string; post_id?: string }> {
  const res = await fetch(`${GRAPH}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params).toString(),
  });
  const json = (await res.json()) as GraphError & {
    id?: string;
    post_id?: string;
  };
  if (!res.ok || json.error) {
    throw new Error(json.error?.message ?? `Erreur API Meta (${res.status})`);
  }
  return json;
}

function absoluteImageUrl(image: string): string {
  return image.startsWith("http") ? image : `${getBaseUrl()}${image}`;
}

function buildCaption(p: SocialProduct, productUrl: string): string {
  const lines = [p.name];
  lines.push(
    p.promoPrice && p.promoPrice < p.price
      ? `Prix promo : ${priceLabel(p.promoPrice)} (au lieu de ${priceLabel(p.price)})`
      : `Prix : ${priceLabel(p.price)}`
  );
  const desc = p.description?.trim();
  if (desc) lines.push("", desc.slice(0, 300) + (desc.length > 300 ? "…" : ""));
  // Le lien renvoie le client vers la fiche produit du site.
  lines.push("", `Commander sur ${SITE_NAME} :`, productUrl);
  return lines.join("\n");
}

async function publishToFacebook(
  cfg: { metaAccessToken: string; facebookPageId: string },
  imageUrl: string,
  caption: string
): Promise<void> {
  await graphPost(`${cfg.facebookPageId}/photos`, {
    url: imageUrl,
    caption,
    access_token: cfg.metaAccessToken,
  });
}

async function publishToInstagram(
  cfg: { metaAccessToken: string; instagramUserId: string },
  imageUrl: string,
  caption: string
): Promise<void> {
  // Étape 1 : conteneur media. Étape 2 : publication.
  const container = await graphPost(`${cfg.instagramUserId}/media`, {
    image_url: imageUrl,
    caption: caption.slice(0, 2200), // limite légende Instagram
    access_token: cfg.metaAccessToken,
  });
  if (!container.id) throw new Error("Conteneur Instagram sans ID");
  await graphPost(`${cfg.instagramUserId}/media_publish`, {
    creation_id: container.id,
    access_token: cfg.metaAccessToken,
  });
}

export async function publishProductToSocial(
  product: SocialProduct,
  targets: { facebook?: boolean; instagram?: boolean }
): Promise<SocialPublishResult[]> {
  const cfg = await getSocialConfig();
  const results: SocialPublishResult[] = [];

  const image = product.images.find(Boolean);
  if (!image) {
    for (const network of ["facebook", "instagram"] as const) {
      if (targets[network]) {
        results.push({
          network,
          ok: false,
          error: "Aucune photo sur l'article — la publication demande une image.",
        });
      }
    }
    return results;
  }

  const imageUrl = absoluteImageUrl(image);
  const caption = buildCaption(product, `${getBaseUrl()}/produit/${product.slug}`);

  if (targets.facebook) {
    if (!cfg.facebookEnabled || !cfg.metaAccessToken || !cfg.facebookPageId) {
      results.push({
        network: "facebook",
        ok: false,
        error: "Facebook non configuré — voir Réglages → Réseaux sociaux.",
      });
    } else {
      try {
        await publishToFacebook(cfg, imageUrl, caption);
        results.push({ network: "facebook", ok: true });
      } catch (err) {
        results.push({
          network: "facebook",
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }
  }

  if (targets.instagram) {
    if (!cfg.instagramEnabled || !cfg.metaAccessToken || !cfg.instagramUserId) {
      results.push({
        network: "instagram",
        ok: false,
        error: "Instagram non configuré — voir Réglages → Réseaux sociaux.",
      });
    } else {
      try {
        await publishToInstagram(cfg, imageUrl, caption);
        results.push({ network: "instagram", ok: true });
      } catch (err) {
        results.push({
          network: "instagram",
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }
  }

  return results;
}
