import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { formatPrice } from "@/lib/constants";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import type { OrderStatus } from "@/types";

const PAYMENT_LABEL: Record<string, string> = {
  mtn_momo: "MTN MoMo",
  orange_money: "Orange Money",
  cash_on_delivery: "À la livraison",
};

export default async function AdminOrdersPage() {
  const rows = await db.select().from(orders);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-navy-900">Commandes</h1>

      {rows.length === 0 ? (
        <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
          Aucune commande enregistrée pour l&apos;instant.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">N°</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Ville</th>
                <th className="px-4 py-3 font-medium">Montant</th>
                <th className="px-4 py-3 font-medium">Paiement</th>
                <th className="px-4 py-3 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-medium">{o.number}</td>
                    <td className="px-4 py-3">{o.customerName}</td>
                    <td className="px-4 py-3">{o.city}</td>
                    <td className="px-4 py-3 font-semibold">
                      {formatPrice(o.total)}
                    </td>
                    <td className="px-4 py-3">
                      {PAYMENT_LABEL[o.paymentMethod] ?? o.paymentMethod}
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusSelect
                        orderId={o.id}
                        current={o.status as OrderStatus}
                      />
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
