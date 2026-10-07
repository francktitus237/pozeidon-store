import { Wrench, ClipboardCheck, MapPin, CalendarCheck } from "lucide-react";
import { InstallationForm } from "@/components/shop/installation-form";
import { getContact } from "@/lib/settings";

export const metadata = {
  title: "Installation — Pozeidon Engineering",
};

const STEPS = [
  {
    icon: ClipboardCheck,
    title: "Demande de devis",
    text: "Remplissez le formulaire ou écrivez-nous sur WhatsApp — réponse sous 24 h.",
  },
  {
    icon: MapPin,
    title: "Visite technique",
    text: "Un technicien évalue l'emplacement idéal (toiture, façade, poteau).",
  },
  {
    icon: Wrench,
    title: "Installation",
    text: "Pose, câblage propre, orientation de l'antenne et mise en route.",
  },
  {
    icon: CalendarCheck,
    title: "Suivi",
    text: "Configuration du réseau, test de débit et assistance après installation.",
  },
];

const INCLUDED = [
  "Kit de fixation selon le type de toit",
  "Passage et habillage du câble",
  "Orientation optimale de l'antenne",
  "Configuration WiFi et test de débit",
];

const EXTRAS = [
  "Perçage béton / ferraillage renforcé",
  "Câble supplémentaire (> 45 m)",
  "Déplacement hors Douala / Yaoundé",
  "Répéteurs WiFi ou routeur additionnel",
];

export default async function InstallationPage() {
  const contact = await getContact();
  return (
    <main>
      {/* Bandeau */}
      <div className="bg-navy-900 px-4 py-12 text-center text-white">
        <Wrench className="mx-auto mb-3 h-10 w-10 text-sky-300" />
        <h1 className="text-3xl font-bold">
          Installation Starlink par des techniciens certifiés
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-sky-100">
          Devis gratuit · Réponse sous 24 h · Intervention à Douala, Yaoundé et
          alentours.
        </p>
      </div>

      <div className="container mx-auto flex flex-col gap-10 px-4 py-10">
        {/* Étapes */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-navy-900">
            Comment ça se passe ?
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <div
                key={s.title}
                className="rounded-lg border bg-card p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-navy-900">
                    {i + 1}
                  </span>
                  <s.icon className="h-4 w-4 text-sky-600" />
                </div>
                <p className="text-sm font-semibold text-navy-900">{s.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Inclus / suppléments */}
        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-card p-5">
            <h3 className="mb-3 font-semibold text-navy-900">
              Inclus dans la prestation
            </h3>
            <ul className="space-y-2 text-sm">
              {INCLUDED.map((i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-0.5 text-stock-in">✓</span> {i}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-cta-500/40 bg-cta-500/5 p-5">
            <h3 className="mb-3 font-semibold text-cta-600">
              Suppléments possibles
            </h3>
            <ul className="space-y-2 text-sm">
              {EXTRAS.map((i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-0.5 text-cta-500">+</span> {i}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              Le devis final dépend de la visite technique.
            </p>
          </div>
        </section>

        {/* Formulaire */}
        <section className="mx-auto w-full max-w-2xl">
          <h2 className="mb-1 text-xl font-bold text-navy-900">
            Demander un devis gratuit
          </h2>
          <p className="mb-5 text-sm text-muted-foreground">
            Décrivez votre besoin — nous vous rappelons sous 24 h. Vous pouvez
            aussi nous écrire sur WhatsApp au {contact.phone}.
          </p>
          <InstallationForm whatsapp={contact.whatsapp} />
        </section>
      </div>
    </main>
  );
}
