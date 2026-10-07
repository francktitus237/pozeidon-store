"use server";

import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const catSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  description: z.string().optional(),
  image: z.string().optional(),
});

export async function createCategory(input: unknown) {
  const session = await auth();
  if (!session) return { error: "Non autorisé" };

  const parsed = catSchema.safeParse(input);
  if (!parsed.success)
    return { error: parsed.error.issues[0]?.message ?? "Données invalides" };

  const slug = slugify(parsed.data.name);
  const existing = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug));
  if (existing.length > 0)
    return { error: `La catégorie « ${parsed.data.name} » existe déjà.` };

  await db.insert(categories).values({
    // id = slug : les produits référencent categoryId = slug (cf. seeds)
    id: slug,
    slug,
    name: parsed.data.name.trim(),
    description: parsed.data.description?.trim() || null,
    image: parsed.data.image?.trim() || null,
  });
  revalidatePath("/gestion/categories");
  revalidatePath("/gestion/articles");
  revalidatePath("/boutique");
  return { ok: true };
}

export async function updateCategory(
  id: string,
  input: unknown
) {
  const session = await auth();
  if (!session) return { error: "Non autorisé" };

  const parsed = catSchema.safeParse(input);
  if (!parsed.success)
    return { error: parsed.error.issues[0]?.message ?? "Données invalides" };

  await db
    .update(categories)
    .set({
      name: parsed.data.name.trim(),
      description: parsed.data.description?.trim() || null,
      image: parsed.data.image?.trim() || null,
    })
    .where(eq(categories.id, id));
  revalidatePath("/gestion/categories");
  revalidatePath("/boutique");
  return { ok: true };
}

export async function deleteCategory(id: string) {
  const session = await auth();
  if (!session) return { error: "Non autorisé" };

  const count = await db
    .select()
    .from(products)
    .where(eq(products.categoryId, id));
  if (count.length > 0)
    return {
      error: `Impossible : ${count.length} article(s) utilisent encore cette catégorie.`,
    };

  await db.delete(categories).where(eq(categories.id, id));
  revalidatePath("/gestion/categories");
  revalidatePath("/boutique");
  return { ok: true };
}
