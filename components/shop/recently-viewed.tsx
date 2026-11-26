"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "./product-card";
import type { Product } from "@/types";

const KEY = "recently-viewed";
const MAX = 9; // stockés (l'article courant + 8 précédents)

// Enregistre l'article consulté dans le navigateur et affiche les
// précédents — réassurance standard e-commerce, sans compte ni serveur.
export function RecentlyViewed({ product }: { product: Product }) {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const list: Product[] = raw ? JSON.parse(raw) : [];
      const others = list.filter((p) => p?.id && p.id !== product.id);
      localStorage.setItem(
        KEY,
        JSON.stringify([product, ...others].slice(0, MAX))
      );
      const previous = others.slice(0, 4);
      queueMicrotask(() => setItems(previous));
    } catch {
      // stockage indisponible (navigation privée stricte…)
    }
  }, [product]);

  if (!items.length) return null;

  return (
    <section className="mt-14">
      <h2 className="mb-4 text-xl font-bold text-navy-900">
        Récemment consultés
      </h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
