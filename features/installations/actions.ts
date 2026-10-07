"use server";

import { db } from "@/lib/db";
import { installationRequests } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";

export interface InstallationFormData {
  name: string;
  phone: string;
  city: string;
  district: string;
  placeType: string;
  hasKit: boolean;
  description?: string;
}

export async function submitInstallation(data: InstallationFormData) {
  await db.insert(installationRequests).values({
    id: crypto.randomUUID(),
    name: data.name,
    phone: data.phone,
    city: data.city,
    district: data.district,
    placeType: data.placeType,
    hasKit: data.hasKit,
    description: data.description || null,
  });

  revalidatePath("/gestion/installations");
  return { ok: true };
}
