"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

export function CartButton() {
  const { count } = useCart();

  return (
    <Link
      href="/panier"
      aria-label="Panier"
      className="relative rounded-md p-2 hover:bg-sky-50"
    >
      <ShoppingCart className="h-6 w-6 text-navy-900" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-cta-500 px-1 text-[11px] font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
