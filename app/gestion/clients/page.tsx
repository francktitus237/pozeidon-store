export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { formatPrice } from "@/lib/constants";
import { Phone } from "lucide-react";

export default async function AdminClientsPage() {
  const allOrders = await db.select().from(orders);

  const customers = new Map<
    string,
    { name: string; phone: string; city: string; orders: number; total: number }
  >();

  for (const o of allOrders) {
    const key = `${o.phone}-${o.customerName}`;
    const existing = customers.get(key);
    if (existing) {
      existing.orders += 1;
      existing.total += o.total;
    } else {
      customers.set(key, {
        name: o.customerName,
        phone: o.phone,
        city: o.city,
        orders: 1,
        total: o.total,
      });
    }
  }

  const rows = Array.from(customers.values()).sort(
    (a, b) => b.total - a.total
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-navy-900">Clients</h1>

      {rows.length === 0 ? (
        <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
          Aucun client pour l&apos;instant.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">Nom</th>
                <th className="px-4 py-3 font-medium">Téléphone</th>
                <th className="px-4 py-3 font-medium">Ville</th>
                <th className="px-4 py-3 font-medium">Commandes</th>
                <th className="px-4 py-3 font-medium">Total achats</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.phone + c.name} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`tel:${c.phone}`}
                      className="inline-flex items-center gap-1 text-sky-600 hover:underline"
                    >
                      <Phone className="h-3.5 w-3.5" /> {c.phone}
                    </a>
                  </td>
                  <td className="px-4 py-3">{c.city}</td>
                  <td className="px-4 py-3">{c.orders}</td>
                  <td className="px-4 py-3 font-semibold">
                    {formatPrice(c.total)}
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
