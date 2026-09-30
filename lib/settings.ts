import { db } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export interface Announcement {
  text: string;
  link?: string;
  enabled: boolean;
  bg?: "navy" | "sky" | "cta";
}

const DEFAULT_ANNOUNCEMENT: Announcement = {
  text: "Livraison Douala & Yaoundé sous 24 h · Installation par technicien certifié",
  enabled: true,
  bg: "navy",
};

const BG_CLASS = {
  navy: "bg-navy-900",
  sky: "bg-sky-600",
  cta: "bg-cta-500",
};

export function getAnnouncementBg(bg?: Announcement["bg"]) {
  return BG_CLASS[bg ?? "navy"];
}

export async function getAnnouncement(): Promise<Announcement> {
  const row = await db.query.settings.findFirst({
    where: eq(settings.key, "announcement"),
  });
  if (!row) return DEFAULT_ANNOUNCEMENT;
  try {
    const parsed = JSON.parse(row.value) as Partial<Announcement>;
    return { ...DEFAULT_ANNOUNCEMENT, ...parsed };
  } catch {
    return DEFAULT_ANNOUNCEMENT;
  }
}
