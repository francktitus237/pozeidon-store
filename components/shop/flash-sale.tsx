"use client";

import { useSyncExternalStore } from "react";
import { Timer } from "lucide-react";
import { ProductCard } from "./product-card";
import type { Product } from "@/types";

function remainingSeconds(endsAt: number) {
  return Math.max(0, Math.floor((endsAt - Date.now()) / 1000));
}

function useRemaining(endsAt: number) {
  const subscribe = (cb: () => void) => {
    const id = setInterval(cb, 1000);
    return () => clearInterval(id);
  };
  const getSnapshot = () => remainingSeconds(endsAt);
  // -1 = valeur fixe rendue côté serveur et lors de l'hydratation
  // (évite le mismatch : le compteur réel apparaît juste après le mount)
  const getServerSnapshot = () => -1;
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) * 1000;
}

interface FlashSaleProps {
  products: Product[];
  endsAt: number; // timestamp ms
}

function formatCountdown(ms: number) {
  if (ms <= 0) return { d: "00", h: "00", m: "00", s: "00" };
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return { d: pad(d), h: pad(h), m: pad(m), s: pad(s) };
}

const PLACEHOLDER = { d: "--", h: "--", m: "--", s: "--" };

export function FlashSale({ products, endsAt }: FlashSaleProps) {
  const left = useRemaining(endsAt);
  const t = left < 0 ? PLACEHOLDER : formatCountdown(left);

  return (
    <section className="rounded-lg border border-cta-500/40 bg-cta-500/5 p-4">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h2 className="flex items-center gap-2 text-xl font-bold text-navy-900">
          <Timer className="h-5 w-5 text-cta-500" />
          Vente flash
        </h2>
        <span className="text-sm text-muted-foreground">se termine dans</span>
        <div className="flex items-center gap-1 font-mono text-sm font-bold text-white">
          <span className="rounded bg-navy-900 px-2 py-1">{t.d} j</span>
          <span className="rounded bg-navy-900 px-2 py-1">{t.h} h</span>
          <span className="rounded bg-navy-900 px-2 py-1">{t.m} m</span>
          <span className="rounded bg-cta-500 px-2 py-1">{t.s} s</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
