"use server";

import { db } from "@/lib/db";
import { productReviews, products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { z } from "zod";

const reviewSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(2, "Nom requis").max(80),
  rating: z.number().int().min(1).max(5),
  text: z.string().min(5, "Avis trop court").max(1000),
});

// Soumission publique — l'avis reste invisible tant qu'il n'est pas approuvé
// dans /gestion/avis (anti-spam).
export async function submitReview(input: unknown) {
  const parsed = reviewSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Avis invalide, vérifiez le formulaire." };
  }
  try {
    const [p] = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.id, parsed.data.productId));
    if (!p) return { error: "Produit introuvable." };

    await db.insert(productReviews).values({
      id: randomUUID(),
      productId: parsed.data.productId,
      name: parsed.data.name.trim(),
      rating: parsed.data.rating,
      text: parsed.data.text.trim(),
      approved: false,
    });
    revalidatePath("/gestion/avis");
    return { ok: true };
  } catch {
    return { error: "Envoi impossible, réessayez." };
  }
}

async function revalidateProductPage(reviewId: string) {
  const [row] = await db
    .select({ slug: products.slug })
    .from(productReviews)
    .leftJoin(products, eq(productReviews.productId, products.id))
    .where(eq(productReviews.id, reviewId));
  if (row?.slug) revalidatePath(`/produit/${row.slug}`);
}

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Non authentifié");
}

export async function approveReview(id: string) {
  await requireAdmin();
  await db
    .update(productReviews)
    .set({ approved: true })
    .where(eq(productReviews.id, id));
  await revalidateProductPage(id);
  revalidatePath("/gestion/avis");
}

export async function deleteReview(id: string) {
  await requireAdmin();
  await revalidateProductPage(id);
  await db.delete(productReviews).where(eq(productReviews.id, id));
  revalidatePath("/gestion/avis");
}
