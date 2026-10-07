"use server";

import { db } from "@/lib/db";
import { promoCodes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { z } from "zod";

const promoSchema = z.object({
  code: z
    .string()
    .min(3, "Code trop court")
    .max(30)
    .transform((s) => s.trim().toUpperCase().replace(/\s+/g, "")),
  percent: z.number().int().min(1).max(90),
  maxUses: z.number().int().positive().optional(),
});

export async function createPromoCode(input: unknown) {
  const session = await auth();
  if (!session) return { error: "Non autorisé" };

  const parsed = promoSchema.safeParse(input);
  if (!parsed.success)
    return { error: parsed.error.issues[0]?.message ?? "Données invalides" };

  const existing = await db
    .select()
    .from(promoCodes)
    .where(eq(promoCodes.code, parsed.data.code));
  if (existing.length > 0)
    return { error: `Le code ${parsed.data.code} existe déjà.` };

  await db.insert(promoCodes).values({
    id: randomUUID(),
    code: parsed.data.code,
    percent: parsed.data.percent,
    maxUses: parsed.data.maxUses ?? null,
    active: true,
    usedCount: 0,
  });
  revalidatePath("/gestion/promos");
  return { ok: true };
}

export async function togglePromoCode(id: string, active: boolean) {
  const session = await auth();
  if (!session) return { error: "Non autorisé" };
  await db.update(promoCodes).set({ active }).where(eq(promoCodes.id, id));
  revalidatePath("/gestion/promos");
  return { ok: true };
}

export async function deletePromoCode(id: string) {
  const session = await auth();
  if (!session) return { error: "Non autorisé" };
  await db.delete(promoCodes).where(eq(promoCodes.id, id));
  revalidatePath("/gestion/promos");
  return { ok: true };
}
