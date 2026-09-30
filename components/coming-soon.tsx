import Link from "next/link";
import Image from "next/image";
import { Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACT, SITE_NAME } from "@/lib/constants";

export function ComingSoon({ title }: { title: string }) {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <Image
        src="/logo-mark.png"
        alt={`Logo ${SITE_NAME}`}
        width={80}
        height={80}
        className="h-20 w-20 object-contain"
      />
      <div className="flex items-center gap-2 rounded-full bg-sky-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-navy-900">
        <Wrench className="h-3.5 w-3.5" />
        Mise à jour en cours
      </div>
      <div>
        <h1 className="text-2xl font-bold text-navy-900">{title}</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Ce service n&apos;est pas encore opérationnel. La plateforme est mise
          à jour au fur et à mesure — merci de votre patience.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Button
          render={<Link href="/" />}
          nativeButton={false}
          className="bg-navy-900 text-white hover:bg-navy-700"
        >
          Retour à l&apos;accueil
        </Button>
        <Button
          render={
            <a
              href={`https://wa.me/${CONTACT.whatsapp}`}
              target="_blank"
              rel="noreferrer"
            />
          }
          nativeButton={false}
          className="bg-whatsapp-500 text-white hover:opacity-90"
        >
          Nous contacter sur WhatsApp
        </Button>
      </div>
    </main>
  );
}
