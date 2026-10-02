// Exécuté une seule fois au démarrage du serveur Next.js.
// Crée les tables Postgres en production (idempotent : IF NOT EXISTS).

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const url = process.env.DATABASE_URL ?? "dev.db";
  if (!url.startsWith("postgres")) return;

  const { default: postgres } = await import("postgres");
  const sql = postgres(url, { prepare: false, max: 1 });

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
    console.log("[db] Schéma Postgres vérifié/créé.");

    // ── Seed initial si la base est vide (premier déploiement) ──
    const [{ count: catCount }] = await sql<
      { count: string }[]
    >`SELECT COUNT(*)::text AS count FROM categories`;

    if (Number(catCount) === 0) {
      const { CATEGORIES } = await import("./lib/constants");
      for (const c of CATEGORIES) {
        await sql`
          INSERT INTO categories (id, slug, name)
          VALUES (${c.slug}, ${c.slug}, ${c.name})
          ON CONFLICT (slug) DO NOTHING`;
      }
      console.log(`[db] ${CATEGORIES.length} catégories insérées.`);
    }

    const [{ count: prodCount }] = await sql<
      { count: string }[]
    >`SELECT COUNT(*)::text AS count FROM products`;

    if (Number(prodCount) === 0) {
      const { DEMO_PRODUCTS } = await import(
        "./features/products/data"
      );
      for (const p of DEMO_PRODUCTS) {
        await sql`
          INSERT INTO products (
            id, slug, name, reference, description, price, promo_price,
            stock, status, category_id, images, video_url,
            installation_available
          ) VALUES (
            ${p.id}, ${p.slug}, ${p.name}, ${p.reference},
            ${p.description ?? null}, ${p.price}, ${p.promoPrice ?? null},
            ${p.stock}, ${p.status}, ${p.categoryId},
            ${sql.json(p.images)}, ${p.videoUrl ?? null},
            ${p.installationAvailable}
          )
          ON CONFLICT (id) DO NOTHING`;
      }
      console.log(`[db] ${DEMO_PRODUCTS.length} produits démo insérés.`);
    }
  } catch (e) {
    console.error("[db] Échec init Postgres :", e);
  } finally {
    await sql.end();
  }
}
