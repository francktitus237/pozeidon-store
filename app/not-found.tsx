import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SITE_NAME } from "@/lib/constants";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-sky-50 px-4 text-center">
      <Image
        src="/logo-mark.png"
        alt={`Logo ${SITE_NAME}`}
        width={96}
        height={96}
        className="h-24 w-24 object-contain"
      />
      <div>
        <p className="text-6xl font-bold text-navy-900">404</p>
        <h1 className="mt-2 text-xl font-semibold">Page introuvable</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
      </div>
      <div className="flex gap-3">
        <Button
          render={<Link href="/" />}
          nativeButton={false}
          className="bg-navy-900 text-white hover:bg-navy-700"
        >
          Retour à l&apos;accueil
        </Button>
        <Button
          render={<Link href="/boutique" />}
          nativeButton={false}
          variant="outline"
        >
          Voir la boutique
        </Button>
      </div>
    </main>
  );
}
