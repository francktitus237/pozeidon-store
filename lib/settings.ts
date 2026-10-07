import { db } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { CONTACT } from "@/lib/constants";

export interface Announcement {
  text: string;
  link?: string;
  enabled: boolean;
  bg?: "navy" | "sky" | "cta";
}

const DEFAULT_ANNOUNCEMENT: Announcement = {
  text: "Ordinateurs neufs & occasion · Accessoires Starlink & informatique · Installation & maintenance · Livraison express Douala & Yaoundé",
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

// ── Contenu du site administrable (listes JSON dans la table settings) ──

export interface Realisation {
  city: string;
  label: string;
  image?: string;
}

const DEFAULT_REALISATIONS: Realisation[] = [
  { city: "Douala", label: "villa" },
  { city: "Kribi", label: "hôtel" },
  { city: "Bertoua", label: "ONG" },
  { city: "Yaoundé", label: "bureau" },
];

export interface Testimonial {
  name: string;
  rating: number;
  text: string;
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    name: "Marc T., Douala",
    rating: 5,
    text: "Installation faite en 3 heures, débit excellent. Équipe sérieuse.",
  },
  {
    name: "Aïcha N., Yaoundé",
    rating: 5,
    text: "Commande passée le lundi, matériel livré le mardi.",
  },
  {
    name: "ONG Sahel",
    rating: 4,
    text: "Bon conseil sur le choix du kit pour notre site isolé.",
  },
];

export interface Conseil {
  title: string;
  image?: string;
}

const DEFAULT_CONSEILS: Conseil[] = [
  { title: "Comment choisir un ordinateur d'occasion fiable ?" },
  { title: "Starlink ou fibre optique : que choisir au Cameroun ?" },
  { title: "Bien protéger son réseau WiFi à la maison" },
];

async function getJsonList<T>(
  key: string,
  defaults: T[]
): Promise<T[]> {
  try {
    const row = await db.query.settings.findFirst({
      where: eq(settings.key, key),
    });
    if (!row) return defaults;
    const parsed = JSON.parse(row.value);
    return Array.isArray(parsed) ? (parsed as T[]) : defaults;
  } catch {
    return defaults;
  }
}

export function getRealisations(): Promise<Realisation[]> {
  return getJsonList("realisations", DEFAULT_REALISATIONS);
}

export function getTestimonials(): Promise<Testimonial[]> {
  return getJsonList("testimonials", DEFAULT_TESTIMONIALS);
}

export function getConseils(): Promise<Conseil[]> {
  return getJsonList("conseils", DEFAULT_CONSEILS);
}

// ── Coordonnées générales du site (éditables dans Réglages) ──

export interface ContactInfo {
  whatsapp: string;
  phone: string;
  address: string;
  hours: string;
}

const DEFAULT_CONTACT: ContactInfo = {
  whatsapp: CONTACT.whatsapp,
  phone: CONTACT.phone,
  address: CONTACT.address,
  hours: "Lun – Sam : 8h – 18h",
};

export async function getContact(): Promise<ContactInfo> {
  try {
    const row = await db.query.settings.findFirst({
      where: eq(settings.key, "contact"),
    });
    if (!row) return DEFAULT_CONTACT;
    const parsed = JSON.parse(row.value) as Partial<ContactInfo>;
    return { ...DEFAULT_CONTACT, ...parsed };
  } catch {
    return DEFAULT_CONTACT;
  }
}

// ── Vidéo publicitaire de l'accueil (éditable dans Contenu du site) ──

export interface PromoVideo {
  url: string;
  title: string;
  enabled: boolean;
}

const DEFAULT_PROMO_VIDEO: PromoVideo = {
  url: "",
  title: "Découvrez nos services",
  enabled: false,
};

export async function getPromoVideo(): Promise<PromoVideo> {
  try {
    const row = await db.query.settings.findFirst({
      where: eq(settings.key, "promo_video"),
    });
    if (!row) return DEFAULT_PROMO_VIDEO;
    const parsed = JSON.parse(row.value) as Partial<PromoVideo>;
    return { ...DEFAULT_PROMO_VIDEO, ...parsed };
  } catch {
    return DEFAULT_PROMO_VIDEO;
  }
}

/** Extrait l'ID YouTube d'une URL, null si ce n'est pas du YouTube */
export function youtubeEmbedUrl(url: string): string | null {
  const m =
    url.match(/youtube\.com\/watch\?v=([\w-]{11})/) ??
    url.match(/youtu\.be\/([\w-]{11})/) ??
    url.match(/youtube\.com\/embed\/([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

// ── Configuration des paiements (éditable dans Réglages) ──

export interface PaymentConfig {
  momoEnabled: boolean;
  momoNumber: string;
  momoInstructions: string;
  orangeEnabled: boolean;
  orangeNumber: string;
  orangeInstructions: string;
  codEnabled: boolean;
}

const DEFAULT_PAYMENTS: PaymentConfig = {
  momoEnabled: true,
  momoNumber: "",
  momoInstructions:
    "Notre équipe vous envoie le numéro marchand MTN après validation.",
  orangeEnabled: true,
  orangeNumber: "",
  orangeInstructions:
    "Notre équipe vous envoie le numéro marchand Orange après validation.",
  codEnabled: true,
};

export async function getPaymentConfig(): Promise<PaymentConfig> {
  try {
    const row = await db.query.settings.findFirst({
      where: eq(settings.key, "payment_config"),
    });
    if (!row) return DEFAULT_PAYMENTS;
    const parsed = JSON.parse(row.value) as Partial<PaymentConfig>;
    return { ...DEFAULT_PAYMENTS, ...parsed };
  } catch {
    return DEFAULT_PAYMENTS;
  }
}

// ── Comptes administrateurs (éditable dans Réglages) ──
// Les mots de passe sont stockés hachés (SHA-256 + sel), jamais en clair.

export interface AdminUser {
  id: string;
  username: string;
  passwordHash: string; // format "sel:hash"
  createdAt: string;
}

export async function readAdminUsers(): Promise<AdminUser[]> {
  try {
    const row = await db.query.settings.findFirst({
      where: eq(settings.key, "admin_users"),
    });
    if (!row) return [];
    const parsed = JSON.parse(row.value);
    return Array.isArray(parsed) ? (parsed as AdminUser[]) : [];
  } catch {
    return [];
  }
}

export async function getAdminUsers(): Promise<
  { id: string; username: string; createdAt: string }[]
> {
  const users = await readAdminUsers();
  // Ne jamais exposer les hash côté client
  return users.map(({ id, username, createdAt }) => ({
    id,
    username,
    createdAt,
  }));
}

export async function findAdminUser(
  username: string
): Promise<AdminUser | null> {
  const users = await readAdminUsers();
  return users.find((u) => u.username === username) ?? null;
}

export async function saveAdminUsers(users: AdminUser[]) {
  const { settings } = await import("@/lib/db/schema");
  await db
    .insert(settings)
    .values({ key: "admin_users", value: JSON.stringify(users) })
    .onConflictDoUpdate({
      target: settings.key,
      set: { value: JSON.stringify(users), updatedAt: new Date() },
    });
}
