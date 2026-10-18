// Constantes métier du site

export const SITE_NAME = "Pozeidon Engineering SARL";

export const CATEGORIES = [
  { slug: "ordinateurs-neufs", name: "Ordinateurs neufs" },
  { slug: "ordinateurs-occasion", name: "Ordinateurs d'occasion" },
  { slug: "accessoires-starlink", name: "Accessoires Starlink" },
  { slug: "accessoires-informatique", name: "Accessoires informatique" },
  { slug: "services", name: "Services & maintenance" },
  { slug: "promotions", name: "Promotions" },
] as const;

// Frais de livraison et forfaits d'installation : gérés dans Réglages
// (table settings, clé "tariffs") — voir lib/settings.ts getTariffs().

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

// Fin affichée par le compteur de la vente flash (+2 jours).
export const FLASH_SALE_END = Date.now() + 2 * 24 * 3600 * 1000;
