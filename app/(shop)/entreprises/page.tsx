import Link from "next/link";
import { Building2, Wifi, ShieldCheck, Headset } from "lucide-react";
import { getContact } from "@/lib/settings";

export const metadata = { title: "Entreprises — Pozeidon Engineering" };

const OFFERS = [
  {
    icon: Wifi,
    title: "Internet Starlink pour entreprise",
    text: "Connexion haut débit pour bureaux, hôtels et sites éloignés — déploiement rapide avec installation clé en main.",
  },
  {
    icon: Building2,
    title: "Équipement informatique",
    text: "Parc d'ordinateurs neufs ou reconditionnés contrôlés, écrans, réseaux — devis sur volume avec tarifs dégressifs.",
  },
  {
    icon: ShieldCheck,
    title: "Vidéosurveillance",
    text: "Étude, pose et configuration de caméras de surveillance adaptées à votre site.",
  },
  {
    icon: Headset,
    title: "Maintenance & contrats",
    text: "Dépannage, maintenance préventive et contrats d'assistance pour votre parc informatique.",
  },
];

export default async function EntreprisesPage() {
  const contact = await getContact();
  const msg = encodeURIComponent(
    "Bonjour, je souhaite un devis entreprise (internet, équipement ou surveillance)."
  );
  return (
    <main>
      <div className="bg-navy-900 px-4 py-12 text-center text-white">
        <Building2 className="mx-auto mb-3 h-10 w-10 text-sky-300" />
        <h1 className="text-3xl font-bold">Offres Entreprises &amp; Hôtels</h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-sky-100">
          Pozeidon Engineering équipe les entreprises, hôtels et institutions :
          internet, matériel informatique, surveillance et maintenance.
        </p>
      </div>

      <div className="container mx-auto flex flex-col gap-10 px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-2">
          {OFFERS.map((o) => (
            <div
              key={o.title}
              className="rounded-lg border bg-card p-5 transition-shadow hover:shadow-md"
            >
              <o.icon className="mb-2 h-6 w-6 text-sky-600" />
              <h2 className="font-semibold text-navy-900">{o.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{o.text}</p>
            </div>
          ))}
        </div>

        <div className="rounded-lg border bg-sky-50 p-6 text-center">
          <h2 className="text-lg font-bold text-navy-900">
            Besoin d&apos;un devis personnalisé ?
          </h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            Décrivez votre projet — réponse sous 24 h ouvrées. Intervention sur
            Douala, Yaoundé et tout le Cameroun.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link
              href={`https://wa.me/${contact.whatsapp}?text=${msg}`}
              target="_blank"
              className="rounded-lg bg-whatsapp-500 px-5 py-2.5 font-medium text-white hover:opacity-90"
            >
              Demander un devis sur WhatsApp
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border px-5 py-2.5 font-medium text-navy-900 hover:bg-white"
            >
              Formulaire de contact
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
