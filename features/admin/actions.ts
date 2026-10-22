"use server";

// Actions serveur pour la gestion du catalogue (CRUD produits)

import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { auth } from "@/auth";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function requireAuth() {
  const session = await auth();
  if (!session) throw new Error("Non autorisé");
}

export interface ProductFormData {
  name: string;
  reference: string;
  description?: string;
  price: number;
  promoPrice?: number | null;
  stock: number;
  status: string;
  categoryId: string;
  images: string[];
  videoUrl?: string;
  installationAvailable: boolean;
}

export async function createProduct(data: ProductFormData) {
  await requireAuth();
  const id = crypto.randomUUID();
  const slug = `${slugify(data.name)}-${id.slice(0, 6)}`;
  // Référence auto-générée si l'admin ne la renseigne pas : PZ-XXXXXX
  const reference =
    data.reference.trim() ||
    `PZ-${id.replace(/-/g, "").slice(0, 6).toUpperCase()}`;

  await db.insert(products).values({
    id,
    slug,
    name: data.name,
    reference,
    description: data.description || null,
    price: data.price,
    promoPrice: data.promoPrice || null,
    stock: data.stock,
    status: data.status,
    categoryId: data.categoryId,
    images: [...new Set((data.images ?? []).filter(Boolean))],
    videoUrl: data.videoUrl || null,
    installationAvailable: data.installationAvailable,
  });

  revalidateTag("products", "max");
  revalidatePath("/gestion/articles");
  revalidatePath("/");
  return { ok: true };
}

export async function updateProduct(id: string, data: ProductFormData) {
  await requireAuth();
  // Si la référence est vidée, on conserve l'ancienne
  let reference = data.reference.trim();
  if (!reference) {
    const [existing] = await db
      .select({ reference: products.reference })
      .from(products)
      .where(eq(products.id, id));
    reference =
      existing?.reference ??
      `PZ-${id.replace(/-/g, "").slice(0, 6).toUpperCase()}`;
  }
  await db
    .update(products)
    .set({
      name: data.name,
      reference,
      description: data.description || null,
      price: data.price,
      promoPrice: data.promoPrice || null,
      stock: data.stock,
      status: data.status,
      categoryId: data.categoryId,
      images: [...new Set((data.images ?? []).filter(Boolean))],
      videoUrl: data.videoUrl || null,
      installationAvailable: data.installationAvailable,
    })
    .where(eq(products.id, id));

  revalidateTag("products", "max");
  revalidatePath("/gestion/articles");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteProduct(id: string) {
  await requireAuth();
  await db.delete(products).where(eq(products.id, id));
  revalidateTag("products", "max");
  revalidatePath("/gestion/articles");
  revalidatePath("/");
  return { ok: true };
}
