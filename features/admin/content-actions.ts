"use server";

// Actions serveur pour gérer le contenu du site (réalisations, témoignages,
// conseils) — listes JSON stockées dans la table settings.

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import type { Realisation, Testimonial, Conseil } from "@/lib/settings";

async function upsertSetting(key: string, value: unknown) {
  const session = await auth();
  if (!session) throw new Error("Non authentifié");

  await db
    .insert(settings)
    .values({
      key,
      value: JSON.stringify(value),
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: settings.key,
      set: {
        value: JSON.stringify(value),
        updatedAt: new Date(),
      },
    });

  revalidatePath("/");
  revalidatePath("/gestion/contenu");
}

export async function updateRealisations(items: Realisation[]) {
  await upsertSetting(
    "realisations",
    items.filter((r) => r.city.trim() || r.label.trim() || r.image)
  );
}

export async function updateTestimonials(items: Testimonial[]) {
  await upsertSetting(
    "testimonials",
    items.filter((t) => t.name.trim() || t.text.trim())
  );
}

export async function updateConseils(items: Conseil[]) {
  await upsertSetting(
    "conseils",
    items.filter((c) => c.title.trim() || c.image)
  );
}
