import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { seedCatalog } from "@/lib/seed-runner";

// GET /api/admin/seed-catalog — relance manuelle du seed catalogue.
// Le même seed tourne déjà automatiquement au démarrage (lib/init-db.ts) ;
// cette route sert à le déclencher à la demande. Réservée aux admins.
// Idempotent : références produits et images existantes ignorées.
export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const result = await seedCatalog();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("[seed-catalog] error", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
