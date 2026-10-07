"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import type { Announcement, CookieBanner, ContactInfo } from "@/lib/settings";

export async function updateAnnouncement(data: Announcement) {
  const session = await auth();
  if (!session) throw new Error("Non authentifié");

  await db
    .insert(settings)
    .values({
      key: "announcement",
      value: JSON.stringify(data),
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: settings.key,
      set: {
        value: JSON.stringify(data),
        updatedAt: new Date(),
      },
    });

  revalidatePath("/");
  revalidatePath("/gestion/reglages");
}

export async function updateCookieBanner(data: CookieBanner) {
  const session = await auth();
  if (!session) throw new Error("Non authentifié");

  await db
    .insert(settings)
    .values({
      key: "cookie_banner",
      value: JSON.stringify(data),
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: settings.key,
      set: {
        value: JSON.stringify(data),
        updatedAt: new Date(),
      },
    });

  revalidatePath("/");
  revalidatePath("/gestion/reglages");
}

export async function updateContact(data: ContactInfo) {
  const session = await auth();
  if (!session) throw new Error("Non authentifié");

  await db
    .insert(settings)
    .values({
      key: "contact",
      value: JSON.stringify(data),
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: settings.key,
      set: {
        value: JSON.stringify(data),
        updatedAt: new Date(),
      },
    });

  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/gestion/reglages");
}
