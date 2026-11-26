// Requêtes newsletter — liste des abonnés (admin uniquement).

import { db } from "@/lib/db";
import { newsletterSubscribers } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { toIso } from "@/lib/dates";

export interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

export async function getSubscribers(): Promise<Subscriber[]> {
  try {
    const rows = await db
      .select()
      .from(newsletterSubscribers)
      .orderBy(desc(newsletterSubscribers.createdAt));
    return rows.map((r) => ({
      id: r.id,
      email: r.email,
      createdAt: toIso(r.createdAt),
    }));
  } catch {
    return [];
  }
}
