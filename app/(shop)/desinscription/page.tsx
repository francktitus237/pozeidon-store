import Link from "next/link";
import { MailX } from "lucide-react";
import { UnsubscribeConfirm } from "./unsubscribe-confirm";

export const metadata = { title: "Désinscription newsletter" };

// Destination du lien « Se désinscrire » en bas de chaque campagne.
// Confirmation par clic : évite que les scanners d'emails (qui suivent les
// liens automatiquement) ne désinscrivent les gens sans leur accord.
export default async function DesinscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string }>;
}) {
  const { e } = await searchParams;
  const valid = !!e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  return (
    <main className="container mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-20 text-center">
      <MailX className="h-12 w-12 text-muted-foreground" />
      <h1 className="text-2xl font-bold text-navy-900">
        {valid ? "Se désinscrire de la newsletter" : "Lien invalide"}
      </h1>
      {valid ? (
        <UnsubscribeConfirm email={e!} />
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Ce lien de désinscription est invalide ou a déjà été utilisé.
          </p>
          <Link
            href="/"
            className="mt-2 rounded-full bg-navy-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-navy-700"
          >
            Retour à la boutique
          </Link>
        </>
      )}
    </main>
  );
}
