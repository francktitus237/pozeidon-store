// Types partagés du projet

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  image?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  reference: string;
  description?: string;
  price: number; // en FCFA
  promoPrice?: number;
  stock: number;
  status: "in_stock" | "on_order" | "out_of_stock";
  categoryId: string;
  images: string[];
  videoUrl?: string;
  installationAvailable: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  withInstallation?: boolean;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "mtn_momo" | "orange_money" | "cash_on_delivery";

export interface Order {
  id: string;
  number: string;
  customerName: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  city: string;
  district: string;
  landmark?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  promoCode?: string;
  status: OrderStatus;
  createdAt: string;
}

export interface InstallationRequest {
  id: string;
  name: string;
  phone: string;
  city: string;
  district: string;
  placeType: "maison" | "immeuble" | "entreprise";
  hasKit: boolean;
  description?: string;
  photoUrl?: string;
  status: "new" | "quoted" | "scheduled" | "done" | "cancelled";
  createdAt: string;
}
