import type { Metadata } from "next";
import { WishlistView } from "@/components/shop/wishlist-view";

export const metadata: Metadata = {
  title: "Mes favoris",
};

export default function FavorisPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-navy-900">Mes favoris</h1>
      <WishlistView />
    </main>
  );
}
