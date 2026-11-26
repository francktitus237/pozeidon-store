"use server";

import { db } from "@/lib/db";
import { installationRequests } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";

const installationSchema = z.object({
  name: z.string().trim().min(2, "Nom requis").max(120),
  phone: z.string().min(9, "Téléphone invalide").max(20),
  city: z.string().trim().min(2, "Ville requise").max(80),
  district: z.string().trim().min(2, "Quartier requis").max(80),
  placeType: z.string().trim().min(2).max(60),
  hasKit: z.boolean(),
  kitType: z.string().trim().max(60).optional(),
  preferredDate: z.string().trim().max(10).optional(),
  description: z.string().trim().max(2000).optional(),
  photoUrl: z.string().trim().max(300).optional(),
  // Champ honeypot invisible — rempli uniquement par les bots.
  website: z.string().optional(),
});

export type InstallationFormData = z.infer<typeof installationSchema>;

export async function submitInstallation(input: unknown) {
  const parsed = installationSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Données invalides, vérifiez le formulaire." };
  }
  const data = parsed.data;

  // Anti-spam : honeypot rempli = bot → faux succès sans écrire en base.
  if (data.website?.trim()) {
    return { ok: true };
  }

  await db.insert(installationRequests).values({
    id: crypto.randomUUID(),
    name: data.name,
    phone: data.phone.replace(/\D/g, ""),
    city: data.city,
    district: data.district,
    placeType: data.placeType,
    hasKit: data.hasKit,
    kitType: data.hasKit ? data.kitType || null : null,
    preferredDate: data.preferredDate || null,
    description: data.description || null,
    photoUrl: data.photoUrl || null,
  });

  revalidatePath("/gestion/installations");
  return { ok: true };
}

const STATUS_VALUES = ["new", "quoted", "scheduled", "done", "cancelled"];

// Changement de statut d'une demande (admin).
export async function updateInstallationStatus(id: string, status: string) {
  const session = await auth();
  if (!session) return { error: "Non authentifié" };
  if (!STATUS_VALUES.includes(status)) return { error: "Statut invalide." };

  await db
    .update(installationRequests)
    .set({ status })
    .where(eq(installationRequests.id, id));
  revalidatePath("/gestion/installations");
  return { ok: true };
}
