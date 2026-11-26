"use server";

import { db } from "@/lib/db";
import { newsletterSubscribers, promoCodes, settings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath, revalidateTag } from "next/cache";
import { randomUUID } from "crypto";
import { z } from "zod";
import { getNewsletterConfig } from "@/lib/settings";
import { sendMarketing, shell } from "@/lib/email";
import { getBaseUrl } from "@/lib/site";

const emailSchema = z.string().trim().toLowerCase().email().max(200);

// Code promo offert à l'inscription (configuré dans /gestion/newsletter).
// Renvoyé uniquement s'il est actif et sous sa limite d'utilisation.
async function welcomeOffer() {
  const { welcomeCode } = await getNewsletterConfig();
  const code = welcomeCode.trim().toUpperCase();
  if (!code) return undefined;
  const [promo] = await db
    .select()
    .from(promoCodes)
    .where(eq(promoCodes.code, code));
  if (!promo || !promo.active) return undefined;
  if (promo.maxUses != null && promo.usedCount >= promo.maxUses)
    return undefined;
  return { code: promo.code, percent: promo.percent };
}

// Inscription publique (footer). Un email déjà inscrit renvoie ok : on ne
// révèle pas si l'adresse existe déjà.
export async function subscribeNewsletter(input: unknown) {
  const parsed = emailSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Adresse email invalide." };
  }
  try {
    const [existing] = await db
      .select({ id: newsletterSubscribers.id })
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, parsed.data));
    if (!existing) {
      await db.insert(newsletterSubscribers).values({
        id: randomUUID(),
        email: parsed.data,
      });
      revalidatePath("/gestion/newsletter");
    }
    const welcome = (await welcomeOffer()) ?? null;
    return { ok: true, welcome };
  } catch {
    return { error: "Inscription impossible, réessayez." };
  }
}

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Non authentifié");
}

export async function deleteSubscriber(id: string) {
  await requireAdmin();
  await db
    .delete(newsletterSubscribers)
    .where(eq(newsletterSubscribers.id, id));
  revalidatePath("/gestion/newsletter");
}

// Code promo affiché après inscription newsletter (admin).
export async function updateNewsletterConfig(welcomeCode: string) {
  await requireAdmin();
  const code = welcomeCode.trim().toUpperCase();
  if (code) {
    const [promo] = await db
      .select({ id: promoCodes.id })
      .from(promoCodes)
      .where(eq(promoCodes.code, code));
    if (!promo) {
      return { error: `Le code « ${code} » n'existe pas dans Codes promo.` };
    }
  }
  await db
    .insert(settings)
    .values({
      key: "newsletter",
      value: JSON.stringify({ welcomeCode: code }),
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: settings.key,
      set: {
        value: JSON.stringify({ welcomeCode: code }),
        updatedAt: new Date(),
      },
    });
  revalidateTag("settings", "max");
  revalidatePath("/gestion/newsletter");
  return { ok: true };
}

// ── Campagne : email groupé envoyé à tous les abonnés (admin) ──
// Resend gratuit = 100 emails/jour → on borne à 95 par campagne.
const MAX_CAMPAIGN = 95;

const campaignSchema = z.object({
  subject: z.string().trim().min(3).max(120),
  body: z.string().trim().min(10).max(5000),
});

export async function sendNewsletterCampaign(input: unknown) {
  await requireAdmin();
  const parsed = campaignSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Sujet (3-120 car.) et message (10-5000 car.) requis." };
  }

  const subs = await db
    .select({ email: newsletterSubscribers.email })
    .from(newsletterSubscribers);
  if (!subs.length) return { error: "Aucun abonné." };
  if (subs.length > MAX_CAMPAIGN) {
    return {
      error: `${subs.length} abonnés — la limite quotidienne est ${MAX_CAMPAIGN}.`,
    };
  }

  const base = getBaseUrl();
  const { subject, body } = parsed.data;
  const paragraphs = body
    .split("\n")
    .filter((l) => l.trim())
    .map((l) => `<p style="margin:0 0 12px">${escapeHtml(l)}</p>`)
    .join("");

  let sent = 0;
  for (const s of subs) {
    const unsub = `${base}/desinscription?e=${encodeURIComponent(s.email)}`;
    const html = shell(
      paragraphs +
        `<p style="font-size:11px;color:#aaa;margin-top:24px">` +
        `<a href="${unsub}" style="color:#aaa">Se désinscrire</a></p>`
    );
    if (await sendMarketing(s.email, subject, html)) sent++;
  }
  if (!sent) {
    return {
      error:
        "Envoi impossible — configurez la clé Resend dans Réglages → Emails.",
    };
  }
  return { ok: true, sent, total: subs.length };
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

// Désinscription publique via le lien en bas de chaque campagne.
export async function unsubscribeByEmail(email: string) {
  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) return { ok: false };
  try {
    await db
      .delete(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, parsed.data));
    revalidatePath("/gestion/newsletter");
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
