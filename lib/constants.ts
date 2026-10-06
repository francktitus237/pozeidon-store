// Constantes métier du site

export const SITE_NAME = "Pozeidon Engineering";

export const CATEGORIES = [
  { slug: "ordinateurs", name: "Ordinateurs neufs & occasion" },
  { slug: "accessoires-starlink", name: "Accessoires Starlink" },
  { slug: "accessoires-informatique", name: "Accessoires informatique" },
  { slug: "services", name: "Services & maintenance" },
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
  whatsapp: "237696179594",
  phone: "6 96 17 95 94",
  address: "Akwa, Rue Equinoxe — en face Boissons du Cameroun, Carrefour Central, Douala",
};

export function formatPrice(amount: number): string {
  return `${amount.toLocaleString("fr-FR").replace(/\u202f/g, " ")} FCFA`;
}

/** Affiche le prix ou "Prix sur demande" si le montant n'est pas fixé (0). */
export function priceLabel(amount: number): string {
  return amount > 0 ? formatPrice(amount) : "Prix sur demande";
}
