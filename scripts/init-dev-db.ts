// Initialise la base SQLite de dev : crée les tables si absentes +
// catégories et réglages par défaut. Aucun produit démo n'est inséré :
// le catalogue vient de l'admin / de l'import catalogue.
// Utilisé par le build Docker (prerender) et en local :
//   npx tsx scripts/init-dev-db.ts

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { readdirSync } from "fs";
import path from "path";
import * as schema from "../lib/db/schema.sqlite";
import { CATEGORIES } from "../lib/constants";

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
  CREATE TABLE IF NOT EXISTS promo_codes (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    percent INTEGER NOT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    max_uses INTEGER,
    used_count INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );
  CREATE TABLE IF NOT EXISTS files (
    id TEXT PRIMARY KEY,
    mime TEXT NOT NULL,
    data TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );
`);

// Ajout des colonnes apparues après la première version (bases existantes)
const addColumn = (table: string, col: string, def: string) => {
  const cols = sqlite.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[];
  if (!cols.some((c) => c.name === col)) {
    sqlite.exec(`ALTER TABLE ${table} ADD COLUMN ${col} ${def}`);
  }
};
addColumn("orders", "discount", "INTEGER NOT NULL DEFAULT 0");
addColumn("products", "video_url", "TEXT");

// Migration : scinder l'ancienne catégorie "ordinateurs" en neufs / occasion
sqlite.exec(`
  INSERT OR IGNORE INTO categories (id, slug, name) VALUES
    ('ordinateurs-neufs', 'ordinateurs-neufs', 'Ordinateurs neufs'),
    ('ordinateurs-occasion', 'ordinateurs-occasion', 'Ordinateurs d''occasion');
  UPDATE products SET category_id = 'ordinateurs-occasion'
    WHERE category_id = 'ordinateurs'
      AND (name LIKE '%occasion%' OR reference LIKE '%OCC%');
  UPDATE products SET category_id = 'ordinateurs-neufs'
    WHERE category_id = 'ordinateurs';
  DELETE FROM categories
    WHERE slug = 'ordinateurs'
      AND NOT EXISTS (SELECT 1 FROM products WHERE category_id = 'ordinateurs');
`);

// Nettoie les références d'images mortes (fichiers perdus au rebuild)
{
  const onDisk = new Set<string>();
  for (const d of [
    process.env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads"),
    path.join(process.cwd(), "public", "images"),
  ]) {
    try {
      for (const f of readdirSync(d)) onDisk.add(f);
    } catch {}
  }
  // Uploads stockés en base (table files) : présents même sans volume
  const inDb = new Set<string>();
  try {
    const fileRows = sqlite.prepare("SELECT id FROM files").all() as { id: string }[];
    for (const r of fileRows) inDb.add(r.id);
  } catch {}
  const alive = (src: unknown): boolean => {
    if (typeof src !== "string") return false;
    if (src.startsWith("http")) return true;
    if (src.startsWith("/uploads/")) {
      const name = src.split("/").pop() ?? "";
      return inDb.has(name) || onDisk.has(name);
    }
    if (src.startsWith("/images/"))
      return onDisk.has(src.split("/").pop() ?? "");
    return true;
  };
  const rows = sqlite
    .prepare("SELECT id, images FROM products")
    .all() as { id: string; images: string }[];
  const upd = sqlite.prepare("UPDATE products SET images = ? WHERE id = ?");
  for (const r of rows) {
    try {
      const imgs = JSON.parse(r.images) as unknown[];
      const kept = (Array.isArray(imgs) ? imgs : []).filter(alive);
      if (kept.length !== imgs.length) upd.run(JSON.stringify(kept), r.id);
    } catch {}
  }
  const cats = sqlite
    .prepare("SELECT id, image FROM categories WHERE image IS NOT NULL")
    .all() as { id: string; image: string | null }[];
  const updCat = sqlite.prepare("UPDATE categories SET image = NULL WHERE id = ?");
  for (const c of cats) if (c.image && !alive(c.image)) updCat.run(c.id);
}

sqlite.pragma("foreign_keys = OFF"); // les ids démo ne sont pas toujours cohérents
const db = drizzle(sqlite, { schema });

async function main() {
  const existingCats = db.select().from(schema.categories).all();
  if (existingCats.length > 0) {
    console.log("Base déjà initialisée — seed ignoré.");
    return;
  }
  // onConflictDoNothing : le bloc de migration ci-dessus a peut-être déjà
  // inséré ordinateurs-neufs / ordinateurs-occasion (base fraîche ou existante)
  await db
    .insert(schema.categories)
    .values(
      CATEGORIES.map((c) => ({
        id: c.slug, // categoryId des produits démo référence le slug
        slug: c.slug,
        name: c.name,
      }))
    )
    .onConflictDoNothing();
  await db.insert(schema.settings).values({
    key: "announcement",
    value: JSON.stringify({
      enabled: true,
      text: "Accessoires Starlink · Accessoires informatique · Installation certifiée · Livraison express Douala & Yaoundé",
      link: "",
      bg: "navy",
    }),
  });
  console.log(`Seed OK : ${CATEGORIES.length} catégories (aucun produit démo).`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
