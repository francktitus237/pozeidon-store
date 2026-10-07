import Image from "next/image";
import Link from "next/link";
import { BookOpen, MessageCircle } from "lucide-react";
import { getConseils, getContact } from "@/lib/settings";

export const metadata = { title: "Conseils — Pozeidon Engineering" };
export const dynamic = "force-dynamic";

export default async function ConseilsPage() {
  const [conseils, contact] = await Promise.all([getConseils(), getContact()]);
  const msg = encodeURIComponent(
    "Bonjour, j'ai besoin d'un conseil technique (internet, informatique)."
  );

  return (
    <main>
      <div className="bg-navy-900 px-4 py-12 text-center text-white">
        <BookOpen className="mx-auto mb-3 h-10 w-10 text-sky-300" />
        <h1 className="text-3xl font-bold">Conseils &amp; Guides</h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-sky-100">
          Nos recommandations pour choisir, installer et entretenir votre
          équipement informatique et internet.
        </p>
      </div>

      <div className="container mx-auto px-4 py-10">
        {conseils.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Nos guides arrivent bientôt — contactez-nous directement en
            attendant.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {conseils.map((c, i) => (
              <article
                key={i}
                className="overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-video bg-sky-50">
                  {c.image ? (
                    <Image
                      src={c.image}
                      alt={c.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <BookOpen className="h-10 w-10 text-sky-300" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="font-semibold text-navy-900">{c.title}</h2>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-10 rounded-lg border bg-sky-50 p-6 text-center">
          <h2 className="text-lg font-bold text-navy-900">
            Une question technique ?
          </h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            Notre équipe vous conseille gratuitement avant tout achat.
          </p>
          <Link
            href={`https://wa.me/${contact.whatsapp}?text=${msg}`}
            target="_blank"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-whatsapp-500 px-5 py-2.5 font-medium text-white hover:opacity-90"
          >
            <MessageCircle className="h-4 w-4" />
            Poser ma question
          </Link>
        </div>
      </div>
    </main>
  );
}
