// Initialise la base SQLite de dev : crée les tables si absentes + seed démo.
// Utilisé par le build Docker (prerender) et en local :
//   npx tsx scripts/init-dev-db.ts

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "../lib/db/schema.sqlite";
import { CATEGORIES } from "../lib/constants";
import { DEMO_PRODUCTS } from "../features/products/data";

const sqlite = new Database(process.env.DATABASE_URL ?? "dev.db");

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    image TEXT
  );
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    reference TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    promo_price INTEGER,
    stock INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'in_stock',
    category_id TEXT NOT NULL REFERENCES categories(id),
    images TEXT NOT NULL DEFAULT '[]',
    video_url TEXT,
    installation_available INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );
  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT,
    email TEXT,
    city TEXT NOT NULL,
    district TEXT NOT NULL,
    landmark TEXT,
    items TEXT NOT NULL,
    subtotal INTEGER NOT NULL,
    delivery_fee INTEGER NOT NULL DEFAULT 0,
    total INTEGER NOT NULL,
    payment_method TEXT NOT NULL,
    promo_code TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  );
  CREATE TABLE IF NOT EXISTS installation_requests (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    city TEXT NOT NULL,
    district TEXT NOT NULL,
    place_type TEXT NOT NULL,
    has_kit INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    photo_url TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );
`);

sqlite.pragma("foreign_keys = OFF"); // les ids démo ne sont pas toujours cohérents
const db = drizzle(sqlite, { schema });

async function main() {
  const existing = db.select().from(schema.products).all();
  if (existing.length > 0) {
    console.log(`${existing.length} produits déjà en base — seed ignoré.`);
    return;
  }
  await db.insert(schema.categories).values(
    CATEGORIES.map((c) => ({
      id: c.slug, // categoryId des produits démo référence le slug
      slug: c.slug,
      name: c.name,
    }))
  );
  await db.insert(schema.products).values(
    DEMO_PRODUCTS.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      reference: p.reference,
      description: p.description,
      price: p.price,
      promoPrice: p.promoPrice,
      stock: p.stock,
      status: p.status,
      categoryId: p.categoryId,
      images: p.images,
      installationAvailable: p.installationAvailable,
    }))
  );
  await db.insert(schema.settings).values({
    key: "announcement",
    value: JSON.stringify({
      enabled: true,
      text: "Accessoires Starlink · Accessoires informatique · Installation certifiée · Livraison express Douala & Yaoundé",
      link: "",
      bg: "navy",
    }),
  });
  console.log(`Seed OK : ${CATEGORIES.length} catégories, ${DEMO_PRODUCTS.length} produits.`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
