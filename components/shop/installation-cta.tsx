import Link from "next/link";
import { Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InstallationCta() {
  return (
    <section className="flex flex-col items-center gap-4 rounded-lg bg-sky-100 px-6 py-10 text-center">
      <Wrench className="h-10 w-10 text-navy-900" />
      <h2 className="text-2xl font-bold text-navy-900">
        Vous avez déjà votre kit ?
      </h2>
      <p className="max-w-md text-sm text-navy-700">
        Nos techniciens l&apos;installent chez vous, partout au Cameroun.
        Devis gratuit, réponse sous 24 h.
      </p>
      <Button
        render={<Link href="/installation" />}
        nativeButton={false}
        className="bg-cta-500 text-white hover:bg-cta-600"
      >
        Demander une installation
      </Button>
    </section>
  );
}
