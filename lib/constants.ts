// Constantes métier du site

export const SITE_NAME = "Pozeidon Engineering";

export const CATEGORIES = [
  { slug: "cables-connectique", name: "Câbles & connectique" },
  { slug: "supports-fixations", name: "Supports & fixations" },
  { slug: "energie-onduleurs", name: "Énergie & onduleurs" },
  { slug: "protection-etancheite", name: "Protection & étanchéité" },
  { slug: "antennes-routeurs", name: "Antennes & routeurs" },
  { slug: "accessoires-starlink", name: "Accessoires Starlink" },
  { slug: "accessoires-informatique", name: "Accessoires informatique" },
  { slug: "promotions", name: "Promotions" },
] as const;

export const DELIVERY_CITIES: Record<string, number> = {
  Douala: 0,
  Yaoundé: 0,
  Kribi: 3000,
};

export const INSTALLATION_PRICES = {
  toiture_simple: 65000,
  toiture_haute: 85000,
  pose_sur_mat: 120000,
  site_professionnel: null, // sur devis
} as const;

export const PAYMENT_METHODS = [
  { id: "mtn_momo", label: "MTN Mobile Money" },
  { id: "orange_money", label: "Orange Money" },
  { id: "cash_on_delivery", label: "Paiement à la livraison" },
] as const;

export const CONTACT = {
  whatsapp: "2376XXXXXXXX",
  phone: "6XX XX XX XX",
};

export function formatPrice(amount: number): string {
  return `${amount.toLocaleString("fr-FR").replace(/\u202f/g, " ")} FCFA`;
}
