import Link from "next/link";
import Image from "next/image";
import { MapPin, Award, Users, Clock } from "lucide-react";
import { getContact } from "@/lib/settings";
import { SITE_NAME } from "@/lib/constants";

export const metadata = { title: "À propos — Pozeidon Engineering" };

const VALUES = [
  {
    icon: Award,
    title: "Qualité contrôlée",
    text: "Chaque produit d'occasion est testé avant la mise en vente. Neuf ou occasion, vous savez ce que vous achetez.",
  },
  {
    icon: Users,
    title: "Accompagnement",
    text: "Conseil avant achat, installation sur site, et assistance après la livraison — vous n'êtes jamais seul.",
  },
  {
    icon: Clock,
    title: "Réactivité",
    text: "Réponse sous 24 h aux demandes de devis et à vos questions, par WhatsApp ou téléphone.",
  },
];

export default async function AproposPage() {
  const contact = await getContact();
  return (
    <main>
      <div className="bg-navy-900 px-4 py-12 text-center text-white">
        <Image
          src="/logo-mark.png"
          alt={SITE_NAME}
          width={56}
          height={56}
          className="mx-auto mb-3 h-14 w-14 object-contain"
        />
        <h1 className="text-3xl font-bold">À propos de {SITE_NAME}</h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-sky-100">
          Votre partenaire informatique et connectivité à Douala — vente,
          installation et maintenance.
        </p>
      </div>

      <div className="container mx-auto flex flex-col gap-10 px-4 py-10">
        {/* Présentation */}
        <section className="mx-auto max-w-3xl">
          <h2 className="mb-3 text-xl font-bold text-navy-900">Qui sommes-nous</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {SITE_NAME} est une entreprise basée à Douala spécialisée dans la
            vente de matériel informatique (ordinateurs neufs et occasion
            contrôlés, accessoires), l'installation et la configuration de kits
            Starlink, la maintenance informatique et la vidéosurveillance.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Notre objectif : rendre la technologie fiable et accessible aux
            particuliers comme aux entreprises, avec un accompagnement de bout
            en bout — du choix du produit à l'installation sur site.
          </p>
        </section>

        {/* Valeurs */}
        <section className="grid gap-4 sm:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-lg border bg-card p-5">
              <v.icon className="mb-2 h-6 w-6 text-sky-600" />
              <h3 className="font-semibold text-navy-900">{v.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{v.text}</p>
            </div>
          ))}
        </section>

        {/* Zone + CTA */}
        <section className="rounded-lg border bg-sky-50 p-6 text-center">
          <MapPin className="mx-auto mb-2 h-6 w-6 text-sky-600" />
          <p className="font-semibold text-navy-900">{contact.address}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Ouvert : {contact.hours}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link
              href="/boutique"
              className="rounded-lg bg-cta-500 px-5 py-2.5 font-medium text-white hover:bg-cta-600"
            >
              Voir la boutique
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border px-5 py-2.5 font-medium text-navy-900 hover:bg-white"
            >
              Nous contacter
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
