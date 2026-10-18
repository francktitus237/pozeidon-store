import { CartView } from "@/components/cart/cart-view";
import { getTariffs } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const tariffs = await getTariffs();
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-navy-900">Mon panier</h1>
      <CartView cities={tariffs.deliveryCities} />
    </main>
  );
}
