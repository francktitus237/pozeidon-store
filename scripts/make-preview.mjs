// Génère catalog-import/preview.html (galerie vérifiable dans le navigateur)
// et catalog-import/products.csv (Excel) à partir de products.json.
// Usage : node scripts/make-preview.mjs

import { readFileSync, writeFileSync } from "fs";
import path from "path";

const OUT = "catalog-import";
const products = JSON.parse(
  readFileSync(path.join(OUT, "products.json"), "utf8")
);

const fmt = (n) => (n ? n.toLocaleString("fr-FR") + " FCFA" : "—");
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;");

const cards = products
  .map((p, i) => {
    const img = (p.images?.[0] ?? "").replace("/uploads/", "images/");
    return `<div class="card">
  <div class="num">#${i + 1}</div>
  ${img ? `<img src="${esc(img)}" loading="lazy" alt="">` : `<div class="noimg">Pas d'image</div>`}
  <div class="body">
    <div class="name">${esc(p.name)}</div>
    <div class="price">${fmt(p.price)}${p.promoPrice ? ` <span class="promo">promo ${fmt(p.promoPrice)}</span>` : ""}</div>
    <div class="ref">Réf : ${esc(p.reference ?? "—")}</div>
  </div>
</div>`;
  })
  .join("\n");

const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>Catalogue ordinateurs neufs — vérification (${products.length} produits)</title>
<style>
  body{font-family:system-ui,Segoe UI,sans-serif;margin:0;background:#f3f4f6;color:#111}
  header{background:#0f172a;color:#fff;padding:20px 28px}
  h1{margin:0;font-size:1.3rem}
  .sub{opacity:.75;font-size:.85rem;margin-top:4px}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px;padding:20px;max-width:1600px;margin:0 auto}
  .card{background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08);position:relative}
  .num{position:absolute;top:8px;left:8px;background:#0f172acc;color:#fff;font-size:.7rem;padding:2px 7px;border-radius:8px;z-index:2}
  .card img{width:100%;height:180px;object-fit:contain;background:#fff}
  .noimg{height:180px;display:flex;align-items:center;justify-content:center;color:#9ca3af;background:#e5e7eb}
  .body{padding:12px}
  .name{font-size:.85rem;font-weight:600;line-height:1.3;min-height:3.3em}
  .price{color:#15803d;font-weight:700;margin-top:6px;font-size:.95rem}
  .promo{color:#dc2626;font-size:.75rem;font-weight:600;display:block}
  .ref{color:#6b7280;font-size:.72rem;margin-top:4px;word-break:break-all}
</style>
</head>
<body>
<header>
  <h1>Catalogue ordinateurs neufs — vérification</h1>
  <div class="sub">${products.length} produits extraits de glotelho.cm · à valider avant import dans la boutique</div>
</header>
<div class="grid">
${cards}
</div>
</body>
</html>`;

writeFileSync(path.join(OUT, "preview.html"), html, "utf8");

// CSV pour Excel (séparateur ; pour Excel FR, BOM UTF-8)
const csvRows = [
  ["n°", "nom", "prix_fcfa", "prix_promo_fcfa", "reference", "categorie", "images", "url_source"].join(";"),
  ...products.map((p, i) =>
    [
      i + 1,
      `"${String(p.name).replace(/"/g, '""')}"`,
      p.price ?? "",
      p.promoPrice ?? "",
      `"${p.reference ?? ""}"`,
      p.categoryId,
      `"${(p.images ?? []).join(", ")}"`,
      `"${p.sourceUrl}"`,
    ].join(";")
  ),
];
writeFileSync(path.join(OUT, "products.csv"), "﻿" + csvRows.join("\r\n"), "utf8");

console.log(`OK : preview.html + products.csv (${products.length} produits)`);
