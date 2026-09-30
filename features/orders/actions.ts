"use server";

import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import type { OrderStatus } from "@/types";

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
