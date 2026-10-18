// Importe catalog-import/products.json dans la base de données.
// - SQLite local (dev.db) par défaut
// - Postgres si DATABASE_URL commence par postgres
// Les images sont copiées de catalog-import/images/ vers uploads/
// pour être servies par /uploads/[name].
// Usage : node scripts/import-catalog.mjs [--dry]

import { readFileSync, readdirSync, copyFileSync, mkdirSync, existsSync } from "fs";
import path from "path";

const OUT_DIR = "catalog-import";
const DRY = process.argv.includes("--dry");
const UPLOADS = process.env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads");

const products = JSON.parse(
  readFileSync(path.join(OUT_DIR, "products.json"), "utf8")
);
console.log(`${products.length} produits à importer.`);

// Copie des images vers uploads/
if (!DRY) {
  mkdirSync(UPLOADS, { recursive: true });
  let copied = 0;
  for (const f of readdirSync(path.join(OUT_DIR, "images"))) {
    const dest = path.join(UPLOADS, f);
    if (!existsSync(dest)) {
      copyFileSync(path.join(OUT_DIR, "images", f), dest);
      copied++;
    }
  }
  console.log(`${copied} images copiées vers ${UPLOADS}/`);
}

const url = process.env.DATABASE_URL ?? "dev.db";

// ── Postgres ─────────────────────────────────────────────
async function importPostgres(pgUrl) {
  const { default: postgres } = await import("postgres");
  const sql = postgres(pgUrl, { prepare: false, max: 1 });
  let inserted = 0;
  try {
    for (const p of products) {
      const id = `imp-${p.slug}`.slice(0, 64);
      await sql`
        INSERT INTO products (
          id, slug, name, reference, description, price, promo_price,
          stock, status, category_id, images, installation_available
        ) VALUES (
          ${id}, ${p.slug}, ${p.name}, ${p.reference ?? p.slug},
          ${p.description ?? null}, ${p.price}, ${p.promoPrice ?? null},
          ${p.stock ?? 5}, ${p.status ?? "in_stock"}, ${p.categoryId},
          ${sql.json(p.images ?? [])}, false
        )
        ON CONFLICT (id) DO NOTHING`;
      inserted++;
    }
  } finally {
    await sql.end();
  }
  return inserted;
}

// ── SQLite ───────────────────────────────────────────────
async function importSqlite(dbPath) {
  const { default: Database } = await import("better-sqlite3");
  const sqlite = new Database(dbPath);
  const stmt = sqlite.prepare(`
    INSERT OR IGNORE INTO products (
      id, slug, name, reference, description, price, promo_price,
      stock, status, category_id, images, installation_available
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`);
  let inserted = 0;
  const tx = sqlite.transaction(() => {
    for (const p of products) {
      const id = `imp-${p.slug}`.slice(0, 64);
      const r = stmt.run(
        id, p.slug, p.name, p.reference ?? p.slug,
        p.description ?? null, p.price, p.promoPrice ?? null,
        p.stock ?? 5, p.status ?? "in_stock", p.categoryId,
        JSON.stringify(p.images ?? [])
      );
      inserted += r.changes;
    }
  });
  tx();
  sqlite.close();
  return inserted;
}

if (DRY) {
  console.log("--dry : rien inséré. Exemple :");
  console.log(JSON.stringify(products[0], null, 2).slice(0, 800));
  process.exit(0);
}

const n = url.startsWith("postgres")
  ? await importPostgres(url)
  : await importSqlite(url);
console.log(`Import terminé : ${n} lignes traitées (${url.startsWith("postgres") ? "Postgres" : "SQLite"}).`);
