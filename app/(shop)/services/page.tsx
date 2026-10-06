import Link from "next/link";
import {
  Truck,
  Wrench,
  MonitorCog,
  Cctv,
  Antenna,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Nos services — Pozeidon Engineering",
};

const SERVICES = [
  {
    icon: MonitorCog,
    title: "Maintenance informatique",
    description:
      "Diagnostic, dépannage et entretien de vos ordinateurs : matériel, performance, virus, récupération de données.",
    cta: "Demander une intervention",
    href: "/contact",
  },
  {
    icon: Wrench,
    title: "Installation systèmes & logiciels",
    description:
      "Installation de Windows, suites bureautiques, antivirus et logiciels métiers sur vos machines neuves ou existantes.",
    cta: "Demander un devis",
    href: "/contact",
  },
  {
    icon: Cctv,
    title: "Caméras de surveillance",
    description:
      "Étude, pose et configuration de systèmes de vidéosurveillance pour domiciles, commerces et entreprises.",
    cta: "Demander un devis",
    href: "/contact",
  },
  {
    icon: Antenna,
    title: "Installation Starlink",
    description:
      "Nos techniciens installent votre kit Starlink : antenne, câblage, configuration du routeur, tests de débit.",
    cta: "Demander une installation",
    href: "/installation",
  },
  {
    icon: Truck,
    title: "Livraison express",
    description:
      "Livraison de vos commandes à Douala, Yaoundé, Kribi et dans tout le Cameroun. Suivi de commande disponible.",
    cta: "Voir la boutique",
    href: "/boutique",
  },
];

export default function ServicesPage() {
  return (
    <main>
      <div className="bg-navy-900 px-4 py-12 text-center text-white">
        <h1 className="text-3xl font-bold">Nos services</h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-sky-100">
          Informatique, accessoires Starlink, installations et accompagnement
          complet au Cameroun.
        </p>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-6 md:grid-cols-2">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="flex flex-col gap-3 rounded-lg border bg-card p-6"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-sky-100 p-2.5">
                  <s.icon className="h-6 w-6 text-navy-900" />
                </div>
                <h2 className="text-lg font-bold text-navy-900">{s.title}</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                {s.description}
              </p>
              <div className="mt-auto pt-2">
                <Button
                  render={<Link href={s.href} />}
                  nativeButton={false}
                  variant="outline"
                  className="gap-1"
                >
                  {s.cta} <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 rounded-lg border bg-sky-50 p-6 text-center">
          <MessageCircle className="h-8 w-8 text-whatsapp-500" />
          <h3 className="font-semibold text-navy-900">
            Une question précise ?
          </h3>
          <p className="max-w-md text-sm text-muted-foreground">
            Contactez-nous par WhatsApp. Nous vous orientons vers le bon service
            sous l&apos;heure.
          </p>
          <Button
            render={<Link href="/contact" />}
            nativeButton={false}
            className="bg-cta-500 text-white hover:bg-cta-600"
          >
            Nous écrire
          </Button>
        </div>
      </div>
    </main>
  );
}
