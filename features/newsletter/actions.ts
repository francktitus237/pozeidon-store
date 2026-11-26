"use server";

import { db } from "@/lib/db";
import { newsletterSubscribers, promoCodes, settings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath, revalidateTag } from "next/cache";
import { randomUUID } from "crypto";
import { z } from "zod";
import { getNewsletterConfig } from "@/lib/settings";

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
