import { NextResponse } from "next/server";
import { z } from "zod";

const checkoutSchema = z.object({
  customerName: z.string().min(2),
  phone: z.string().min(9),
  whatsapp: z.string().optional(),
  email: z.string().email().optional(),
  city: z.string().min(2),
  district: z.string().min(2),
  landmark: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
        withInstallation: z.boolean().optional(),
      })
    )
    .min(1),
  paymentMethod: z.enum(["mtn_momo", "orange_money", "cash_on_delivery"]),
  promoCode: z.string().optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // TODO: recalculer les prix côté serveur (jamais faire confiance au client),
  // créer la commande en DB, déclencher le paiement selon la méthode
  return NextResponse.json({ orderNumber: "CMD-0001" }, { status: 201 });
}
