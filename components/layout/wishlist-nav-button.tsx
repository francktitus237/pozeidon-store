"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/use-wishlist";

export function WishlistNavButton() {
  const { count } = useWishlist();

  return (
    <Link
      href="/favoris"
      aria-label="Favoris"
      className="relative rounded-md p-2 hover:bg-sky-50"
    >
      <Heart className="h-6 w-6 text-navy-900" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-cta-500 px-1 text-[11px] font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
