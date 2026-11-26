"use server";

import { db } from "@/lib/db";
import { orders, products, promoCodes } from "@/lib/db/schema";
import { eq, and, like, inArray, sql } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath, revalidateTag } from "next/cache";
import { randomUUID } from "crypto";
import { z } from "zod";
import { getTariffs } from "@/lib/settings";
import { sendOrderPush, sendStockAlertPush } from "@/lib/push";
import {
  sendOrderConfirmationEmail,
  sendOrderStatusEmail,
} from "@/lib/email";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants";
import { toDate } from "@/lib/dates";
import type { OrderStatus, PaymentMethod } from "@/types";

const createOrderSchema = z.object({
  customerName: z.string().min(2, "Nom requis"),
  phone: z.string().min(9, "Téléphone invalide"),
  whatsapp: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  city: z.string().min(2, "Ville requise"),
  district: z.string().min(2, "Quartier requis"),
  landmark: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive().max(99),
        withInstallation: z.boolean().optional(),
      })
    )
    .min(1, "Panier vide")
    .max(50),
  paymentMethod: z.enum(["mtn_momo", "orange_money", "cash_on_delivery"]),
  promoCode: z.string().optional(),
  // Champ honeypot invisible — rempli uniquement par les bots.
  website: z.string().optional(),
});

const PAYMENT_LABELS: Record<string, string> = {
  mtn_momo: "MTN Mobile Money",
  orange_money: "Orange Money",
  cash_on_delivery: "Paiement à la livraison",
};

function generateOrderNumber(): string {
  const digits = Math.floor(1000000 + Math.random() * 9000000); // 7 chiffres
  return `PZE-${digits}`;
}

export async function createOrder(input: unknown) {
  const parsed = createOrderSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Données invalides, vérifiez le formulaire." };
  }
  const data = parsed.data;

  // Anti-spam : le honeypot rempli = bot → faux succès sans écrire en base
  // (pas de stock décrémenté, pas de push, pas de commande).
  if (data.website?.trim()) {
    return { ok: true, number: generateOrderNumber() };
  }

  // Prix recalculés côté serveur — jamais de confiance au payload client.
  const ids = [...new Set(data.items.map((i) => i.productId))];
  const dbProducts = await db
    .select()
    .from(products)
    .where(inArray(products.id, ids));
  const byId = new Map(dbProducts.map((p) => [p.id, p]));

  const items: {
    productId: string;
    slug: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    withInstallation?: boolean;
  }[] = [];
  for (const i of data.items) {
    const p = byId.get(i.productId);
    if (!p) {
      return { error: "Un ou plusieurs articles sont introuvables." };
    }
    if (p.status === "out_of_stock" || p.stock <= 0) {
      return { error: `« ${p.name} » n'est plus disponible.` };
    }
    items.push({
      productId: p.id,
      slug: p.slug,
      name: p.name,
      price: p.promoPrice ?? p.price,
      quantity: i.quantity,
      image: (p.images as string[] | null)?.[0],
      withInstallation: i.withInstallation,
    });
  }

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const { deliveryCities } = await getTariffs();
  // Ville inconnue quand des tarifs sont configurés → rejet (sinon port offert).
  if (
    Object.keys(deliveryCities).length > 0 &&
    !(data.city in deliveryCities)
  ) {
    return { error: "Ville de livraison invalide." };
  }
  const deliveryFee = deliveryCities[data.city] ?? 0;

  // Code promo : validé côté serveur, remise appliquée sur le sous-total
  let discount = 0;
  let promoCodeUsed: string | null = null;
  const code = data.promoCode?.trim().toUpperCase();
  if (code) {
    const [promo] = await db
      .select()
      .from(promoCodes)
      .where(eq(promoCodes.code, code));
    if (!promo || !promo.active) {
      return { error: `Le code promo « ${code} » est invalide.` };
    }
    if (promo.maxUses != null && promo.usedCount >= promo.maxUses) {
      return { error: `Le code promo « ${code} » a atteint sa limite d'utilisation.` };
    }
    discount = Math.round((subtotal * promo.percent) / 100);
    promoCodeUsed = promo.code;
    await db
      .update(promoCodes)
      .set({ usedCount: promo.usedCount + 1 })
      .where(eq(promoCodes.id, promo.id));
  }

  const total = subtotal - discount + deliveryFee;

  // Numéro de commande : aléatoire + contrainte unique → quelques essais
  // en cas de collision (rare, ~1/10M).
  let orderNumber = generateOrderNumber();
  for (let attempt = 0; ; attempt++) {
    try {
      await db.insert(orders).values({
        id: randomUUID(),
        number: orderNumber,
        customerName: data.customerName.trim(),
        phone: data.phone.replace(/\D/g, ""),
        whatsapp: data.whatsapp?.replace(/\D/g, "") || null,
        email: data.email || null,
        city: data.city,
        district: data.district.trim(),
        landmark: data.landmark?.trim() || null,
        items,
        subtotal,
        deliveryFee,
        total,
        paymentMethod: data.paymentMethod as PaymentMethod,
        promoCode: promoCodeUsed,
        discount,
        status: "pending",
      });
      break;
    } catch (err) {
      if (attempt >= 2) throw err;
      orderNumber = generateOrderNumber();
    }
  }

  // Décrémenter le stock de façon atomique (borné à 0) — sûr même si deux
  // commandes simultanées visent le même article. Un article "en stock"
  // qui tombe à 0 passe automatiquement en "épuisé" ; les articles
  // "sur commande" gardent leur statut.
  const stockAlerts: { name: string; stock: number }[] = [];
  for (const item of items) {
    const p = byId.get(item.productId)!;
    await db
      .update(products)
      .set({
        stock: sql`max(0, ${products.stock} - ${item.quantity})`,
      })
      .where(eq(products.id, item.productId));
    const [after] = await db
      .select({ stock: products.stock })
      .from(products)
      .where(eq(products.id, item.productId));
    const newStock = after?.stock ?? Math.max(0, p.stock - item.quantity);
    if (newStock === 0 && p.status === "in_stock") {
      await db
        .update(products)
        .set({ status: "out_of_stock" })
        .where(eq(products.id, item.productId));
    }
    // Franchissement du seuil vers le bas → alerte stock bas / épuisé
    if (p.stock > LOW_STOCK_THRESHOLD && newStock <= LOW_STOCK_THRESHOLD) {
      stockAlerts.push({ name: p.name, stock: newStock });
    }
  }
  for (const a of stockAlerts) await sendStockAlertPush(a.name, a.stock);

  // Email de confirmation si le client a renseigné une adresse (Resend,
  // activé dans Réglages — échec silencieux, jamais bloquant).
  if (data.email) {
    await sendOrderConfirmationEmail({
      number: orderNumber,
      customerName: data.customerName.trim(),
      email: data.email,
      city: data.city,
      district: data.district.trim(),
      total,
      deliveryFee,
      items,
      paymentLabel: PAYMENT_LABELS[data.paymentMethod] ?? data.paymentMethod,
    });
  }

  // Notification push sur les appareils de l'admin (gratuit, voir Réglages).
  await sendOrderPush({
    number: orderNumber,
    customerName: data.customerName.trim(),
    city: data.city,
    total,
    itemCount: items.reduce((s, i) => s + i.quantity, 0),
  });

  revalidateTag("products", "max");
  revalidatePath("/gestion/commandes");
  revalidatePath("/gestion/statistiques");
  return { ok: true, number: orderNumber };
}

/** Vérifie un code promo sans le consommer (affichage au checkout). */
export async function checkPromo(code: string) {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return { error: "Entrez un code." };
  const [promo] = await db
    .select()
    .from(promoCodes)
    .where(eq(promoCodes.code, normalized));
  if (!promo || !promo.active) return { error: "Code invalide." };
  if (promo.maxUses != null && promo.usedCount >= promo.maxUses)
    return { error: "Ce code a atteint sa limite d'utilisation." };
  return { ok: true, percent: promo.percent, code: promo.code };
}

// Normalise le numéro saisi : "pze 1234", "PZE1234" ou "1234" → "PZE-1234".
function normalizeOrderNumber(raw: string): string {
  const s = raw.trim().toUpperCase().replace(/[\s_]+/g, "");
  if (s.startsWith("PZE-")) return s;
  if (s.startsWith("PZE")) return `PZE-${s.slice(3)}`;
  return `PZE-${s}`;
}

export async function trackOrder(number: string, phone: string) {
  // Le téléphone stocké est en chiffres ; on tolère le préfixe 237 en
  // comparant sur les 9 derniers chiffres (format mobile camerounais).
  const digits = phone.replace(/\D/g, "").slice(-9);
  const [order] = await db
    .select()
    .from(orders)
    .where(
      and(
        eq(orders.number, normalizeOrderNumber(number)),
        like(orders.phone, `%${digits}`)
      )
    );
  return order ?? null;
}

// Retrouver ses commandes sans le numéro : téléphone + nom (comparaison
// assouplie — casse, accents et tirets ignorés). Renvoie le minimum
// nécessaire : numéro, statut, date, total.
export async function findOrdersByPhone(phone: string, name: string) {
  const digits = phone.replace(/\D/g, "").slice(-9);
  if (digits.length < 9) return [];
  const norm = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z]/g, "");
  const needle = norm(name);
  if (!needle) return [];

  const rows = await db
    .select({
      number: orders.number,
      status: orders.status,
      total: orders.total,
      createdAt: orders.createdAt,
      customerName: orders.customerName,
    })
    .from(orders)
    .where(like(orders.phone, `%${digits}`));

  return rows
    .filter((r) => norm(r.customerName) === needle)
    .sort((a, b) => toDate(b.createdAt).getTime() - toDate(a.createdAt).getTime())
    .map(({ number, status, total, createdAt }) => ({
      number,
      status,
      total,
      createdAt,
    }));
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const session = await auth();
  if (!session) throw new Error("Non authentifié");

  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, id));
  await db.update(orders).set({ status }).where(eq(orders.id, id));

  // Email au client si son statut a changé et qu'il a laissé une adresse
  // (silencieux : l'échec email ne bloque jamais le changement de statut).
  if (order?.email && order.status !== status) {
    await sendOrderStatusEmail(
      {
        number: order.number,
        customerName: order.customerName,
        email: order.email,
        city: order.city,
        total: order.total,
        paymentLabel: PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod,
      },
      status
    );
  }

  revalidatePath("/gestion/commandes");
  revalidatePath("/gestion/statistiques");
}
