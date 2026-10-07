import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { inArray } from "drizzle-orm";
import { createOrder } from "@/features/orders/actions";

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

  // Recalculer les prix côté serveur — ne jamais faire confiance au client
  const ids = parsed.data.items.map((i) => i.productId);
  const dbProducts = await db
    .select()
    .from(products)
    .where(inArray(products.id, ids));

  const items = parsed.data.items.map((i) => {
    const p = dbProducts.find((d) => d.id === i.productId);
    if (!p) return null;
    return {
      productId: p.id,
      slug: p.slug,
      name: p.name,
      price: p.promoPrice ?? p.price,
      quantity: i.quantity,
      image: (p.images as string[] | null)?.[0],
      withInstallation: i.withInstallation,
    };
  });

  if (items.some((i) => i === null)) {
    return NextResponse.json(
      { error: "Un ou plusieurs articles sont introuvables." },
      { status: 400 }
    );
  }

  const result = await createOrder({
    customerName: parsed.data.customerName,
    phone: parsed.data.phone,
    whatsapp: parsed.data.whatsapp,
    email: parsed.data.email,
    city: parsed.data.city,
    district: parsed.data.district,
    landmark: parsed.data.landmark,
    items: items.filter((i): i is NonNullable<typeof i> => i !== null),
    paymentMethod: parsed.data.paymentMethod,
  });

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ orderNumber: result.number }, { status: 201 });
}
