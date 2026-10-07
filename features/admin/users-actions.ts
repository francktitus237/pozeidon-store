"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { z } from "zod";
import { hashPassword } from "@/lib/admin-auth";
import {
  findAdminUser,
  readAdminUsers,
  saveAdminUsers,
} from "@/lib/settings";

const userSchema = z.object({
  username: z
    .string()
    .min(3, "Identifiant : 3 caractères minimum")
    .max(30)
    .regex(/^[a-zA-Z0-9_.-]+$/, "Lettres, chiffres, . _ - uniquement"),
  password: z.string().min(8, "Mot de passe : 8 caractères minimum"),
});

export async function createAdminUser(input: unknown) {
  const session = await auth();
  if (!session) return { error: "Non autorisé" };

  const parsed = userSchema.safeParse(input);
  if (!parsed.success)
    return { error: parsed.error.issues[0]?.message ?? "Données invalides" };

  const username = parsed.data.username.trim();
  const envUser = process.env.ADMIN_USERNAME ?? "admin";
  if (username === envUser || (await findAdminUser(username)))
    return { error: "Cet identifiant existe déjà." };

  const raw = await readAdminUsers();
  await saveAdminUsers([
    ...raw,
    {
      id: randomUUID(),
      username,
      passwordHash: hashPassword(parsed.data.password),
      createdAt: new Date().toISOString(),
    },
  ]);
  revalidatePath("/gestion/comptes");
  return { ok: true };
}

export async function deleteAdminUser(id: string) {
  const session = await auth();
  if (!session) return { error: "Non autorisé" };

  const users = await readAdminUsers();
  if (users.length <= 1)
    return { error: "Impossible de supprimer le dernier compte administrateur." };

  const target = users.find((u) => u.id === id);
  if (!target) return { error: "Compte introuvable." };
  if (target.username === session.user?.name)
    return { error: "Vous ne pouvez pas supprimer votre propre compte." };

  await saveAdminUsers(users.filter((u) => u.id !== id));
  revalidatePath("/gestion/comptes");
  return { ok: true };
}
