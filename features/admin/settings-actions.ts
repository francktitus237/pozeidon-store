"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import { revalidatePath, revalidateTag } from "next/cache";
import type {
  AiConfig,
  AnalyticsConfig,
  Announcement,
  CookieBanner,
  ContactInfo,
  EmailConfig,
  PaymentConfig,
  SocialConfig,
  TariffsConfig,
} from "@/lib/settings";

export async function updateAnnouncement(data: Announcement) {
  const session = await auth();
  if (!session) throw new Error("Non authentifié");

  await db
    .insert(settings)
    .values({
      key: "announcement",
      value: JSON.stringify(data),
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: settings.key,
      set: {
        value: JSON.stringify(data),
        updatedAt: new Date(),
      },
    });

  revalidateTag("settings", "max");
  revalidatePath("/");
  revalidatePath("/gestion/reglages");
}

export async function updateCookieBanner(data: CookieBanner) {
  const session = await auth();
  if (!session) throw new Error("Non authentifié");

  await db
    .insert(settings)
    .values({
      key: "cookie_banner",
      value: JSON.stringify(data),
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: settings.key,
      set: {
        value: JSON.stringify(data),
        updatedAt: new Date(),
      },
    });

  revalidateTag("settings", "max");
  revalidatePath("/");
  revalidatePath("/gestion/reglages");
}

export async function updateContact(data: ContactInfo) {
  const session = await auth();
  if (!session) throw new Error("Non authentifié");

  await db
    .insert(settings)
    .values({
      key: "contact",
      value: JSON.stringify(data),
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: settings.key,
      set: {
        value: JSON.stringify(data),
        updatedAt: new Date(),
      },
    });

  revalidateTag("settings", "max");
  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/gestion/reglages");
}

export async function updatePaymentConfig(data: PaymentConfig) {
  const session = await auth();
  if (!session) throw new Error("Non authentifié");

  await db
    .insert(settings)
    .values({
      key: "payment_config",
      value: JSON.stringify(data),
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: settings.key,
      set: {
        value: JSON.stringify(data),
        updatedAt: new Date(),
      },
    });

  revalidateTag("settings", "max");
  revalidatePath("/commande");
  revalidatePath("/gestion/reglages");
}

export async function updateSocialConfig(data: SocialConfig) {
  const session = await auth();
  if (!session) throw new Error("Non authentifié");

  await db
    .insert(settings)
    .values({
      key: "social",
      value: JSON.stringify(data),
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: settings.key,
      set: {
        value: JSON.stringify(data),
        updatedAt: new Date(),
      },
    });

  revalidateTag("settings", "max");
  revalidatePath("/gestion/reglages");
  revalidatePath("/gestion/articles");
}

export async function updateAnalyticsConfig(data: AnalyticsConfig) {
  const session = await auth();
  if (!session) throw new Error("Non authentifié");

  const gaId = data.gaId.trim().toUpperCase();
  if (gaId && !/^G-[A-Z0-9]{4,20}$/.test(gaId)) {
    throw new Error(
      "ID de mesure invalide — format attendu : G-XXXXXXXXXX (Google Analytics 4)"
    );
  }

  await db
    .insert(settings)
    .values({
      key: "analytics",
      value: JSON.stringify({ gaId }),
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: settings.key,
      set: {
        value: JSON.stringify({ gaId }),
        updatedAt: new Date(),
      },
    });

  revalidateTag("settings", "max");
  revalidatePath("/gestion/reglages");
}

export async function updateEmailConfig(data: EmailConfig) {
  const session = await auth();
  if (!session) throw new Error("Non authentifié");

  const clean: EmailConfig = {
    resendApiKey: data.resendApiKey.trim(),
    fromEmail:
      data.fromEmail.trim() || "onboarding@resend.dev",
    orderConfirmationEnabled: !!data.orderConfirmationEnabled,
  };

  await db
    .insert(settings)
    .values({
      key: "email",
      value: JSON.stringify(clean),
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: settings.key,
      set: {
        value: JSON.stringify(clean),
        updatedAt: new Date(),
      },
    });

  revalidateTag("settings", "max");
  revalidatePath("/gestion/reglages");
}

export async function updateAiConfig(data: AiConfig) {
  const session = await auth();
  if (!session) throw new Error("Non authentifié");

  const clean: AiConfig = {
    geminiApiKey: data.geminiApiKey.trim(),
    model: data.model?.trim() || "gemini-3.5-flash-lite",
    ttsModel: data.ttsModel?.trim() || "gemini-2.5-flash-preview-tts",
    ttsVoice: data.ttsVoice?.trim() || "Aoede",
  };
  await db
    .insert(settings)
    .values({
      key: "ai",
      value: JSON.stringify(clean),
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: settings.key,
      set: {
        value: JSON.stringify(clean),
        updatedAt: new Date(),
      },
    });

  revalidateTag("settings", "max");
  revalidatePath("/gestion/reglages");
  revalidatePath("/gestion/articles");
}

// ── Détection automatique des comptes Meta ──
// À partir du token utilisateur, on récupère les Pages gérées (avec leur
// token de Page — celui requis pour publier) et le compte Instagram relié.

export interface DetectedMetaPage {
  id: string;
  name: string;
  pageToken: string;
  instagramUserId: string | null;
  instagramUsername: string | null;
}

export async function detectMetaAccounts(userToken: string) {
  const session = await auth();
  if (!session) throw new Error("Non authentifié");
  const token = userToken.trim();
  if (!token) return { error: "Collez d'abord le token Meta." };
  try {
    const res = await fetch(
      `https://graph.facebook.com/v22.0/me/accounts?fields=id,name,access_token,instagram_business_account{id,username}&access_token=${encodeURIComponent(token)}`
    );
    const json = (await res.json()) as {
      error?: { message?: string };
      data?: {
        id: string;
        name: string;
        access_token: string;
        instagram_business_account?: { id: string; username?: string };
      }[];
    };
    if (!res.ok || json.error) {
      return { error: json.error?.message ?? "Token invalide ou expiré." };
    }
    const pages: DetectedMetaPage[] = (json.data ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      pageToken: p.access_token,
      instagramUserId: p.instagram_business_account?.id ?? null,
      instagramUsername: p.instagram_business_account?.username ?? null,
    }));
    if (!pages.length) {
      return {
        error:
          "Aucune Page trouvée pour ce token — utilisez un token qui gère votre Page Facebook.",
      };
    }
    return { ok: true, pages };
  } catch {
    return { error: "Impossible de joindre Meta — réessayez." };
  }
}

// ── Notifications push des nouvelles commandes ──

export async function getVapidPublicKey() {
  const session = await auth();
  if (!session) throw new Error("Non authentifié");
  const { getPushPublicKey } = await import("@/lib/push");
  return getPushPublicKey();
}

export async function subscribePush(sub: {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}) {
  const session = await auth();
  if (!session) throw new Error("Non authentifié");
  const { savePushSubscription } = await import("@/lib/push");
  await savePushSubscription(sub);
  return { ok: true };
}

export async function unsubscribePush(endpoint: string) {
  const session = await auth();
  if (!session) throw new Error("Non authentifié");
  const { deletePushSubscription } = await import("@/lib/push");
  await deletePushSubscription(endpoint);
  return { ok: true };
}

export async function updateTariffs(data: TariffsConfig) {
  const session = await auth();
  if (!session) throw new Error("Non authentifié");

  await db
    .insert(settings)
    .values({
      key: "tariffs",
      value: JSON.stringify(data),
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: settings.key,
      set: {
        value: JSON.stringify(data),
        updatedAt: new Date(),
      },
    });

  revalidateTag("settings", "max");
  revalidatePath("/commande");
  revalidatePath("/panier");
  revalidatePath("/gestion/reglages");
}
