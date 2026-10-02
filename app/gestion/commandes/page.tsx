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
  const rows = (await db.select().from(orders)).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy-900">Commandes</h1>
        <p className="text-sm text-muted-foreground">
          {rows.length} commande{rows.length > 1 ? "s" : ""}
        </p>
      </div>

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
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Livraison</th>
                <th className="px-4 py-3 font-medium">Articles</th>
                <th className="px-4 py-3 font-medium">Montant</th>
                <th className="px-4 py-3 font-medium">Paiement</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Contact</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => {
                const itemCount = o.items.reduce((s, i) => s + i.quantity, 0);
                const waPhone = o.whatsapp || o.phone;
                return (
                  <tr key={o.id} className="border-b align-top last:border-0">
                    <td className="px-4 py-3 font-mono font-medium">
                      {o.number}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(o.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{o.customerName}</p>
                      <p className="text-xs text-muted-foreground">{o.phone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p>{o.city}</p>
                      <p className="text-xs text-muted-foreground">
                        {o.district}
                        {o.landmark ? ` · ${o.landmark}` : ""}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p>{itemCount} article{itemCount > 1 ? "s" : ""}</p>
                      <p className="max-w-48 truncate text-xs text-muted-foreground">
                        {o.items.map((i) => i.name).join(", ")}
                      </p>
                    </td>
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
                    <td className="px-4 py-3">
                      {waPhone && (
                        <a
                          href={`https://wa.me/${waPhone}?text=${encodeURIComponent(`Bonjour ${o.customerName}, au sujet de votre commande ${o.number}.`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-whatsapp-500 hover:underline"
                        >
                          WhatsApp
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
