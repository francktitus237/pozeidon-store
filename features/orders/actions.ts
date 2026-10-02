"use server";

import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { z } from "zod";
import { DELIVERY_CITIES } from "@/lib/constants";
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
        slug: z.string(),
        name: z.string(),
        price: z.number().int().positive(),
        quantity: z.number().int().positive(),
        image: z.string().optional(),
        withInstallation: z.boolean().optional(),
      })
    )
    .min(1, "Panier vide"),
  paymentMethod: z.enum(["mtn_momo", "orange_money", "cash_on_delivery"]),
});

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

  const subtotal = data.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryFee = DELIVERY_CITIES[data.city] ?? 0;
  const total = subtotal + deliveryFee;
  const orderNumber = generateOrderNumber();

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
    items: data.items,
    subtotal,
    deliveryFee,
    total,
    paymentMethod: data.paymentMethod as PaymentMethod,
    status: "pending",
  });

  revalidatePath("/gestion/commandes");
  return { ok: true, number: orderNumber };
}

export async function trackOrder(number: string, phone: string) {
  const normalizedPhone = phone.replace(/\D/g, "");
  const [order] = await db
    .select()
    .from(orders)
    .where(
      and(
        eq(orders.number, number.trim()),
        eq(orders.phone, normalizedPhone)
      )
    );
  return order ?? null;
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const session = await auth();
  if (!session) throw new Error("Non authentifié");

  await db.update(orders).set({ status }).where(eq(orders.id, id));
  revalidatePath("/gestion/commandes");
  revalidatePath("/gestion/statistiques");
}
