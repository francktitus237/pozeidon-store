import { CartView } from "@/components/cart/cart-view";

export default function CartPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-navy-900">Mon panier</h1>
      <CartView />
    </main>
  );
}
