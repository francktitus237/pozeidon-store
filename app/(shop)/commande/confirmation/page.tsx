import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2, MessageCircle, Search } from "lucide-react";
import { CONTACT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Commande confirmée",
};

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ numero?: string }>;
}) {
  const { numero } = await searchParams;

  const waMessage = encodeURIComponent(
    `Bonjour, je viens de passer la commande ${numero ?? ""} sur votre site.`
  );

  return (
    <main className="container mx-auto max-w-lg px-4 py-16">
      <div className="rounded-lg border bg-card p-8 text-center shadow-sm">
        <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-2xl font-bold text-navy-900">
          Commande enregistrée !
        </h1>
        <p className="mt-2 text-muted-foreground">
          Merci pour votre commande. Notre équipe vous contactera pour confirmer
          la livraison.
        </p>

        {numero && (
          <div className="mt-6 rounded-lg bg-sky-50 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Votre numéro de commande
            </p>
            <p className="mt-1 font-mono text-2xl font-bold tracking-wider text-navy-900">
              {numero}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Notez ce numéro — il vous servira à suivre votre commande.
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href={`https://wa.me/${CONTACT.whatsapp}?text=${waMessage}`}
            target="_blank"
            className="flex items-center justify-center gap-2 rounded-lg bg-whatsapp-500 px-5 py-3 font-semibold text-white transition hover:opacity-90"
          >
            <MessageCircle className="h-5 w-5" />
            Confirmer sur WhatsApp
          </Link>
          <Link
            href="/compte"
            className="flex items-center justify-center gap-2 rounded-lg border px-5 py-3 font-medium text-navy-900 transition hover:bg-sky-50"
          >
            <Search className="h-5 w-5" />
            Suivre ma commande
          </Link>
          <Link
            href="/boutique"
            className="text-sm text-sky-600 hover:underline"
          >
            Continuer mes achats
          </Link>
        </div>
      </div>
    </main>
  );
}
