import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import type { CartItem } from "@/types";

export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image"),
});

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  reference: text("reference").notNull(),
  description: text("description"),
  price: integer("price").notNull(), // FCFA
  promoPrice: integer("promo_price"),
  stock: integer("stock").notNull().default(0),
  status: text("status").notNull().default("in_stock"),
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  videoUrl: text("video_url"),
  installationAvailable: boolean("installation_available")
    .notNull()
    .default(false),
  createdAt: timestamp("created_at")
    .notNull()
    .defaultNow(),
});

export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  number: text("number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  whatsapp: text("whatsapp"),
  email: text("email"),
  city: text("city").notNull(),
  district: text("district").notNull(),
  landmark: text("landmark"),
  items: jsonb("items").$type<CartItem[]>().notNull(),
  subtotal: integer("subtotal").notNull(),
  deliveryFee: integer("delivery_fee").notNull().default(0),
  total: integer("total").notNull(),
  paymentMethod: text("payment_method").notNull(),
  promoCode: text("promo_code"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at")
    .notNull()
    .defaultNow(),
});

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow(),
});

export const installationRequests = pgTable("installation_requests", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  city: text("city").notNull(),
  district: text("district").notNull(),
  placeType: text("place_type").notNull(),
  hasKit: boolean("has_kit").notNull().default(false),
  description: text("description"),
  photoUrl: text("photo_url"),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at")
    .notNull()
    .defaultNow(),
});
