export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { formatPrice } from "@/lib/constants";
import { toDate } from "@/lib/dates";
import { PaginatedTable } from "@/components/admin/paginated-table";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Phone } from "lucide-react";

function waNumber(phone: string) {
  // wa.me exige le format international — préfixe 237 si numéro local
  return phone.length <= 9 ? `237${phone}` : phone;
}

export default async function AdminClientsPage() {
  const allOrders = await db.select().from(orders);

  // Le téléphone est l'identité du client : un même numéro avec des
  // orthographes de nom différentes = un seul client.
  const customers = new Map<
    string,
    {
      name: string;
      phone: string;
      whatsapp: string | null;
      city: string;
      email: string | null;
      orders: number;
      total: number;
      lastOrderAt: Date;
    }
  >();

  for (const o of allOrders) {
    if (o.status === "cancelled") continue; // jamais payées : exclues
    const at = toDate(o.createdAt);
    const existing = customers.get(o.phone);
    if (existing) {
      existing.orders += 1;
      existing.total += o.total;
      if (at > existing.lastOrderAt) {
        existing.lastOrderAt = at;
        existing.name = o.customerName; // nom le plus récent
        existing.city = o.city;
        existing.whatsapp = o.whatsapp;
        existing.email = o.email;
      }
    } else {
      customers.set(o.phone, {
        name: o.customerName,
        phone: o.phone,
        whatsapp: o.whatsapp,
        city: o.city,
        email: o.email,
        orders: 1,
        total: o.total,
        lastOrderAt: at,
      });
    }
  }

  const rows = Array.from(customers.values()).sort(
    (a, b) => b.total - a.total
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Clients</h1>
        <p className="text-sm text-muted-foreground">
          {rows.length} client{rows.length > 1 ? "s" : ""} — triés par total
          d&apos;achats (commandes annulées exclues).
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
          Aucun client pour l&apos;instant.
        </div>
      ) : (
        <PaginatedTable
          headers={[
            "Client",
            "Contact",
            "Ville",
            "Commandes",
            "Dernière",
            "Total achats",
          ]}
          pageSize={10}
        >
          {rows.map((c) => (
            <tr key={c.phone} className="border-b last:border-0">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{c.name}</span>
                  {c.orders >= 3 && (
                    <Badge className="bg-cta-500 text-white hover:bg-cta-500">
                      Fidèle
                    </Badge>
                  )}
                </div>
                {c.email && (
                  <p className="text-xs text-muted-foreground">{c.email}</p>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:+${c.phone}`}
                    className="inline-flex items-center gap-1 text-sky-600 hover:underline"
                  >
                    <Phone className="h-3.5 w-3.5" /> +{c.phone}
                  </a>
                  <a
                    href={`https://wa.me/${waNumber(c.whatsapp || c.phone)}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`WhatsApp ${c.name}`}
                    className="rounded-full bg-whatsapp-500/15 p-1.5 text-whatsapp-600 transition-colors hover:bg-whatsapp-500 hover:text-white"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                  </a>
                </div>
              </td>
              <td className="px-4 py-3">{c.city}</td>
              <td className="px-4 py-3">{c.orders}</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {c.lastOrderAt.toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="px-4 py-3 font-semibold">
                {formatPrice(c.total)}
              </td>
            </tr>
          ))}
        </PaginatedTable>
      )}
    </div>
  );
}
