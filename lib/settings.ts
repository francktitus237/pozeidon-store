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
  text: "Internet par satellite Starlink · Installation certifiée · Accessoires informatique · Livraison express Douala & Yaoundé",
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

export interface CookieBanner {
  enabled: boolean;
  text: string;
  acceptLabel: string;
  declineLabel: string;
  policyLink?: string;
}

const DEFAULT_COOKIE_BANNER: CookieBanner = {
  enabled: true,
  text: "Ce site utilise des cookies pour améliorer votre expérience de navigation et mémoriser votre panier.",
  acceptLabel: "J'accepte",
  declineLabel: "Refuser",
};

export async function getCookieBanner(): Promise<CookieBanner> {
  const row = await db.query.settings.findFirst({
    where: eq(settings.key, "cookie_banner"),
  });
  if (!row) return DEFAULT_COOKIE_BANNER;
  try {
    const parsed = JSON.parse(row.value) as Partial<CookieBanner>;
    return { ...DEFAULT_COOKIE_BANNER, ...parsed };
  } catch {
    return DEFAULT_COOKIE_BANNER;
  }
}
