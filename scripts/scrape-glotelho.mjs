// Scrape les fiches produit glotelho.cm listées dans catalog-import/candidates.txt
// Pour chaque URL : JSON-LD Product (nom, sku, marque, images, description)
// + prix FCFA du HTML → catalog-import/products.json + images téléchargées.
// Usage : node scripts/scrape-glotelho.mjs [maxProduits]

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";

const OUT_DIR = "catalog-import";
const IMG_DIR = path.join(OUT_DIR, "images");
const MAX = process.argv[2] ? Number(process.argv[2]) : Infinity;
const CONCURRENCY = 4;
const DELAY_MS = 300;

mkdirSync(IMG_DIR, { recursive: true });

const urls = readFileSync(path.join(OUT_DIR, "candidates.txt"), "utf8")
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter(Boolean)
  .slice(0, MAX);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const slugify = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
    signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

function extractProduct(html, url) {
  // JSON-LD Product
  const ldBlocks = [...html.matchAll(/<script[^>]*ld\+json[^>]*>([\s\S]*?)<\/script>/g)];
  let ld = null;
  for (const b of ldBlocks) {
    try {
      const j = JSON.parse(b[1]);
      if (j["@type"] === "Product") { ld = j; break; }
    } catch { /* bloc non-JSON */ }
  }
  if (!ld?.name) return null;

  // Prix : le montant en gras (font-extrabold) avant "FCFA" = prix courant.
  // Le montant barré (line-through) = ancien prix → devient le prix normal.
  let price = 0, promoPrice = null;
  const mPrice = html.match(/font-extrabold[^>]*>\s*([\d\s,.]+)\s*FCFA/i);
  if (mPrice) price = Number(mPrice[1].replace(/[\s,]/g, ""));
  const mOld = html.match(/line-through[^>]*>\s*([\d\s,.]+)\s*FCFA/i);
  if (mOld) {
    const old = Number(mOld[1].replace(/[\s,]/g, ""));
    if (old > price) { promoPrice = price; price = old; }
  }
  if (!price && ld.offers) {
    const o = Array.isArray(ld.offers) ? ld.offers[0] : ld.offers;
    price = Number(o?.price ?? 0) || 0;
  }

  const images = Array.isArray(ld.images) && ld.images.length
    ? ld.images
    : [ld.image].filter(Boolean);

  const name = ld.name.replace(/&quot;/g, '"').trim();
  const description = `${ld.brand?.name ? ld.brand.name + " — " : ""}${name}`.slice(0, 400);

  return {
    name,
    sourceUrl: url,
    reference: ld.sku ?? null,
    price,
    promoPrice,
    description,
    images,
  };
}

async function downloadImage(url, destName) {
  const dest = path.join(IMG_DIR, destName);
  if (existsSync(dest)) return `/uploads/${destName}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
    signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) throw new Error(`img HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(dest, buf);
  return `/uploads/${destName}`;
}

async function scrapeOne(url, i) {
  const slug = slugify(url.split("/product/")[1] ?? `p${i}`).replace(/-\d+$/, "");
  try {
    const html = await fetchText(url);
    const p = extractProduct(html, url);
    if (!p) { console.log(`[${i}] pas de JSON-LD : ${url.slice(-60)}`); return null; }

    const localImages = [];
    for (const [j, img] of p.images.slice(0, 3).entries()) {
      try {
        const rawExt = (img.split(".").pop()?.split("?")[0] ?? "jpg").toLowerCase();
        const ext = /^(jpe?g|png|webp|gif|avif)$/.test(rawExt) ? rawExt : "jpg";
        localImages.push(await downloadImage(img, `${slug}${j ? `-${j}` : ""}.${ext}`));
      } catch (e) {
        console.log(`[${i}] img KO (${e.message}) : ${img.slice(-60)}`);
      }
    }

    return {
      slug,
      name: p.name,
      reference: p.reference,
      price: p.price,
      promoPrice: p.promoPrice,
      stock: 5,
      status: "in_stock",
      categoryId: "ordinateurs-neufs",
      description: p.description,
      images: localImages,
      sourceUrl: p.sourceUrl,
    };
  } catch (e) {
    console.log(`[${i}] ERR ${e.message} : ${url.slice(-60)}`);
    return null;
  }
}

console.log(`${urls.length} fiches à scraper…`);
const results = [];
for (let i = 0; i < urls.length; i += CONCURRENCY) {
  const batch = await Promise.all(
    urls.slice(i, i + CONCURRENCY).map((u, j) => scrapeOne(u, i + j))
  );
  results.push(...batch.filter(Boolean));
  console.log(`→ ${results.length}/${urls.length} récupérés`);
  if (i + CONCURRENCY < urls.length) await sleep(DELAY_MS);
}

writeFileSync(
  path.join(OUT_DIR, "products.json"),
  JSON.stringify(results, null, 2),
  "utf8"
);
console.log(`\nOK : ${results.length} produits → ${OUT_DIR}/products.json`);
