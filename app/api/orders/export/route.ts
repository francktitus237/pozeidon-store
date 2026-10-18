import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { auth } from "@/auth";

function csvEscape(value: string | number | null | undefined): string {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const rows = (await db.select().from(orders)).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const headers = [
    "Numero",
    "Date",
    "Client",
    "Telephone",
    "WhatsApp",
    "Email",
    "Ville",
    "Quartier",
    "Adresse",
    "Articles",
    "Quantite",
    "SousTotal",
    "FraisLivraison",
    "Total",
    "Paiement",
    "Statut",
  ];

  const lines = rows.map((o) => {
    const itemCount = o.items.reduce((sum, i) => sum + i.quantity, 0);
    const itemsLabel = o.items.map((i) => `${i.name} x${i.quantity}`).join(" | ");
    return [
      csvEscape(o.number),
      csvEscape(new Date(o.createdAt).toLocaleDateString("fr-FR")),
      csvEscape(o.customerName),
      csvEscape(o.phone),
      csvEscape(o.whatsapp),
      csvEscape(o.email),
      csvEscape(o.city),
      csvEscape(o.district),
      csvEscape(o.landmark),
      csvEscape(itemsLabel),
      csvEscape(itemCount),
      csvEscape(o.subtotal),
      csvEscape(o.deliveryFee),
      csvEscape(o.total),
      csvEscape(o.paymentMethod),
      csvEscape(o.status),
    ].join(",");
  });

  const csv = [headers.join(","), ...lines].join("\r\n");
  const filename = `commandes-pozeidon-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
