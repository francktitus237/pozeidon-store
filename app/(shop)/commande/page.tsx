import type { Metadata } from "next";
import { CheckoutForm } from "@/components/shop/checkout-form";
import { getPaymentConfig } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Finaliser ma commande",
};
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const payments = await getPaymentConfig();
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold text-navy-900">
        Finaliser ma commande
      </h1>
      <CheckoutForm payments={payments} />
    </main>
  );
}
