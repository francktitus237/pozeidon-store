import { NextResponse } from "next/server";

// POST /api/paiements/momo — initie un paiement MTN Mobile Money
// Clés API dans .env.local : MOMO_API_USER, MOMO_API_KEY, MOMO_SUBSCRIPTION_KEY
export async function POST(request: Request) {
  const body = await request.json();

  // TODO: appeler l'API MTN MoMo (collection/requesttopay),
  // enregistrer la transaction, retourner une référence à poller
  return NextResponse.json(
    { message: "Paiement MTN MoMo à implémenter", received: body },
    { status: 501 }
  );
}
