import { User } from "lucide-react";
import { OrderTracker } from "@/components/account/order-tracker";

export const metadata = {
  title: "Mon compte — Pozeidon Engineering",
};

export default function AccountPage() {
  return (
    <main>
      <div className="bg-navy-900 px-4 py-12 text-center text-white">
        <User className="mx-auto mb-3 h-10 w-10 text-sky-300" />
        <h1 className="text-3xl font-bold">Espace client</h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-sky-100">
          Suivez votre commande ou contactez-nous directement.
        </p>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-xl">
          <OrderTracker />
        </div>
      </div>
    </main>
  );
}
