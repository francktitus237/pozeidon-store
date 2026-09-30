import {
  sqliteTable,
  text,
  integer,
} from "drizzle-orm/sqlite-core";

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image"),
});

export const products = sqliteTable("products", {
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
  images: text("images", { mode: "json" }).notNull().default([]),
  videoUrl: text("video_url"),
  installationAvailable: integer("installation_available", {
    mode: "boolean",
  })
    .notNull()
    .default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  number: text("number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  whatsapp: text("whatsapp"),
  email: text("email"),
  city: text("city").notNull(),
  district: text("district").notNull(),
  landmark: text("landmark"),
  items: text("items", { mode: "json" }).notNull(),
  subtotal: integer("subtotal").notNull(),
  deliveryFee: integer("delivery_fee").notNull().default(0),
  total: integer("total").notNull(),
  paymentMethod: text("payment_method").notNull(),
  promoCode: text("promo_code"),
  status: text("status").notNull().default("pending"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const installationRequests = sqliteTable("installation_requests", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  city: text("city").notNull(),
  district: text("district").notNull(),
  placeType: text("place_type").notNull(),
  hasKit: integer("has_kit", { mode: "boolean" }).notNull().default(false),
  description: text("description"),
  photoUrl: text("photo_url"),
  status: text("status").notNull().default("new"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
