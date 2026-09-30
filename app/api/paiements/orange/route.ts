import { NextResponse } from "next/server";

// POST /api/paiements/orange — initie un paiement Orange Money
// Clés API dans .env.local : ORANGE_CLIENT_ID, ORANGE_CLIENT_SECRET
export async function POST(request: Request) {
  const body = await request.json();

  // TODO: appeler l'API Orange Money (OM Pay / Orange Money Web Payment),
  // retourner l'URL de paiement ou la référence de transaction
  return NextResponse.json(
    { message: "Paiement Orange Money à implémenter", received: body },
    { status: 501 }
  );
}
