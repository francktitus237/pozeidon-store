// Initialisation Postgres en production — appelée par instrumentation.ts
// uniquement en runtime Node.js (NEXT_RUNTIME === "nodejs").
// Ne jamais importer ce module depuis un fichier compilé pour l'Edge runtime :
// il utilise fs, path, process.cwd() et postgres.
// Idempotent : CREATE TABLE IF NOT EXISTS / ON CONFLICT.

import { readdirSync } from "fs";
import path from "path";

export async function initPostgres() {
  const url = process.env.DATABASE_URL ?? "dev.db";
  if (!url.startsWith("postgres")) return;

  const { default: postgres } = await import("postgres");
  const sql = postgres(url, {
    prepare: false,
    max: 1,
    onnotice: () => {},
    idle_timeout: 60 * 5,
    max_lifetime: 60 * 30,
    connect_timeout: 30,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof (sql as any).on === "function") {
    (sql as any).on("error", (err: Error) => {
      // Les erreurs de connexion après fermeture ne doivent pas faire planter le serveur.
      console.error("[db] postgres notice (init)", err.message);
    });
  }

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        slug TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        description TEXT,
        image TEXT
      )`;
    await sql`
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
        images JSONB NOT NULL DEFAULT '[]',
        video_url TEXT,
        installation_available BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT now()
      )`;
    await sql`
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
        items JSONB NOT NULL,
        subtotal INTEGER NOT NULL,
        delivery_fee INTEGER NOT NULL DEFAULT 0,
        total INTEGER NOT NULL,
        payment_method TEXT NOT NULL,
        promo_code TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP NOT NULL DEFAULT now()
      )`;
    await sql`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP NOT NULL DEFAULT now()
      )`;
    await sql`
      CREATE TABLE IF NOT EXISTS installation_requests (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        city TEXT NOT NULL,
        district TEXT NOT NULL,
        place_type TEXT NOT NULL,
        has_kit BOOLEAN NOT NULL DEFAULT false,
        description TEXT,
        photo_url TEXT,
        status TEXT NOT NULL DEFAULT 'new',
        created_at TIMESTAMP NOT NULL DEFAULT now()
      )`;
    await sql`
      CREATE TABLE IF NOT EXISTS promo_codes (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL UNIQUE,
        percent INTEGER NOT NULL,
        active BOOLEAN NOT NULL DEFAULT true,
        max_uses INTEGER,
        used_count INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT now()
      )`;
    // Colonnes ajoutées après la première version (bases existantes)
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount INTEGER NOT NULL DEFAULT 0`;
    await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS video_url TEXT`;
    console.log("[db] Schéma Postgres vérifié/créé.");

    // ── Synchronisation du catalogue initial ──
    // Ids des anciens produits démo (remplacés par le nouveau catalogue)
    const LEGACY_IDS = Array.from({ length: 14 }, (_, i) => `p${i + 1}`);

    const { CATEGORIES } = await import("./constants");

    // Seed des catégories UNIQUEMENT si la table est vide.
    // Avant, un upsert à chaque démarrage écrasait les renommages faits
    // dans l'admin et les catégories par défaut réapparaissaient après
    // chaque redéploiement.
    const [{ n: catCount }] =
      await sql`SELECT COUNT(*)::int AS n FROM categories`;
    if (catCount === 0) {
      for (const c of CATEGORIES) {
        await sql`
          INSERT INTO categories (id, slug, name)
          VALUES (${c.slug}, ${c.slug}, ${c.name})
          ON CONFLICT (slug) DO NOTHING`;
      }
    }

    // Migration : l'ancienne catégorie "ordinateurs" est scindée en
    // ordinateurs-neufs / ordinateurs-occasion (heuristique sur le nom).
    await sql`
      UPDATE products SET category_id = 'ordinateurs-occasion'
      WHERE category_id = 'ordinateurs'
        AND (name ILIKE '%occasion%' OR reference ILIKE '%OCC%')`;
    await sql`
      UPDATE products SET category_id = 'ordinateurs-neufs'
      WHERE category_id = 'ordinateurs'`;

    // Supprime les anciens produits démo (les vrais articles admin sont conservés)
    await sql`
      DELETE FROM products WHERE id = ANY(${LEGACY_IDS})`;

    // Les catégories obsolètes ne sont plus supprimées au démarrage :
    // elles se gèrent dans l'admin (/gestion/categories). Le DELETE
    // précédent effaçait les catégories admin encore sans produit.

    // Purge des produits démo (ids ord-*/stl-*/inf-*/srv-*) : la boutique
    // ne contient plus que les articles publiés depuis l'admin.
    const DEMO_IDS = [
      "ord-01", "ord-02", "ord-03",
      "stl-01", "stl-02", "stl-03", "stl-04",
      "stl-05", "stl-06", "stl-07", "stl-08",
      "inf-01", "inf-02", "inf-03", "inf-04", "inf-05", "inf-06",
      "srv-01", "srv-02", "srv-03",
    ];
    await sql`
      DELETE FROM products WHERE id = ANY(${DEMO_IDS})`;

    // Nettoyage des références d'images mortes : les fichiers uploadés
    // avant le passage à uploads/ (ou sans volume) sont perdus au rebuild.
    // On retire des produits/catégories les chemins locaux dont le fichier
    // n'existe plus — le site affiche alors le placeholder au lieu d'un cadre vide.
    const scanDirs = [
      process.env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads"),
      path.join(process.cwd(), "public", "images"),
    ];
    const onDisk = new Set<string>();
    for (const d of scanDirs) {
      try {
        for (const f of readdirSync(/* turbopackIgnore: true */ d))
          onDisk.add(f);
      } catch {
        // dossier absent — ignoré
      }
    }
    const alive = (src: unknown): src is string => {
      if (typeof src !== "string") return false;
      if (src.startsWith("http")) return true; // Cloudinary & co
      if (src.startsWith("/uploads/") || src.startsWith("/images/"))
        return onDisk.has(src.split("/").pop() ?? "");
      return true; // autre asset statique de public/
    };
    const prodRows =
      await sql`SELECT id, images FROM products`;
    for (const r of prodRows) {
      const imgs = Array.isArray(r.images) ? (r.images as unknown[]) : [];
      const kept = imgs.filter(alive);
      if (kept.length !== imgs.length) {
        await sql`UPDATE products SET images = ${sql.json(kept)} WHERE id = ${r.id}`;
      }
    }
    const catRows =
      await sql`SELECT id, image FROM categories WHERE image IS NOT NULL`;
    for (const r of catRows) {
      if (r.image && !alive(r.image)) {
        await sql`UPDATE categories SET image = NULL WHERE id = ${r.id}`;
      }
    }

    console.log(
      `[db] Catalogue initialisé : ${CATEGORIES.length} catégories (produits gérés depuis l'admin).`
    );
  } catch (e) {
    console.error("[db] Échec init Postgres :", e);
  } finally {
    await sql.end();
  }
}
