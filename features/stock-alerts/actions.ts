"use server";

import { db } from "@/lib/db";
import { products, stockAlerts } from "@/lib/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { z } from "zod";
import { sendMarketing, shell } from "@/lib/email";
import { getBaseUrl } from "@/lib/site";
import { formatPrice } from "@/lib/constants";

// Alertes « prévenez-moi » sur les articles épuisés.
// Le client laisse son téléphone (WhatsApp) et/ou un email ; quand l'article
// repasse en stock, email auto + liste admin pour relance WhatsApp.

const alertSchema = z.object({
  productId: z.string().min(1),
  phone: z
    .string()
    .trim()
    .transform((s) => s.replace(/[\s.-]/g, ""))
    .pipe(z.string().regex(/^\+?\d{9,15}$/, "Numéro de téléphone invalide.")),
  email: z.union([z.literal(""), z.string().trim().toLowerCase().email()]),
  website: z.string().optional(), // honeypot
});

export async function subscribeStockAlert(input: unknown) {
  const parsed = alertSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Numéro de téléphone invalide." };
  }
  const { productId, phone, email, website } = parsed.data;
  if (website) return { ok: true }; // bot : fausse réussite

  try {
    const [product] = await db
      .select({ id: products.id, status: products.status })
      .from(products)
      .where(eq(products.id, productId));
    if (!product) return { error: "Article introuvable." };
    if (product.status !== "out_of_stock") {
      return { error: "Cet article est disponible — vous pouvez commander." };
    }

    await db.insert(stockAlerts).values({
      id: randomUUID(),
      productId,
      phone,
      email: email || null,
    });
    revalidatePath("/gestion/alertes");
    return { ok: true };
  } catch {
    return { error: "Inscription impossible, réessayez." };
  }
}

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Non authentifié");
}

export async function deleteStockAlert(id: string) {
  await requireAdmin();
  await db.delete(stockAlerts).where(eq(stockAlerts.id, id));
  revalidatePath("/gestion/alertes");
}

// Appelée quand un article repasse en stock (updateProduct admin).
// Email aux inscrits qui en ont laissé un + marque tout le monde « notifié »
// (les relances WhatsApp restent visibles dans /gestion/alertes).
export async function notifyBackInStock(
  productId: string,
  productName: string,
  slug: string,
  price: number
) {
  const pending = await db
    .select()
    .from(stockAlerts)
    .where(
      and(eq(stockAlerts.productId, productId), isNull(stockAlerts.notifiedAt))
    );
  if (!pending.length) return 0;

  const url = `${getBaseUrl()}/produit/${slug}`;
  const html = shell(
    `<h2 style="margin:0 0 12px">Bonne nouvelle !</h2>` +
      `<p><strong>${productName}</strong> est de retour en stock ` +
      `à ${formatPrice(price)}.</p>` +
      `<p><a href="${url}" style="color:#fff;background:#1B1F5C;` +
      `padding:10px 20px;border-radius:8px;text-decoration:none;` +
      `display:inline-block">Voir l'article</a></p>`
  );

  const now = new Date();
  for (const a of pending) {
    if (a.email) {
      await sendMarketing(
        a.email,
        `${productName} est de retour en stock`,
        html
      );
    }
    await db
      .update(stockAlerts)
      .set({ notifiedAt: now })
      .where(eq(stockAlerts.id, a.id));
  }
  revalidatePath("/gestion/alertes");
  return pending.length;
}
