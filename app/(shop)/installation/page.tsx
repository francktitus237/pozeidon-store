import {
  Wrench,
  ClipboardCheck,
  MapPin,
  CalendarCheck,
  MessageCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { InstallationForm } from "@/components/shop/installation-form";
import { getContact } from "@/lib/settings";

export const metadata = {
  title: "Installation — Pozeidon Engineering SARL",
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

        {/* Formulaire + réassurance */}
        <section className="grid gap-6 lg:grid-cols-3">
          {/* Colonne réassurance */}
          <aside className="flex flex-col gap-4 lg:col-span-1">
            <div className="rounded-lg border bg-card p-5">
              <h2 className="text-xl font-bold text-navy-900">
                Demander un devis gratuit
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Décrivez votre besoin — un technicien vous rappelle sous 24 h.
              </p>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li className="flex items-center gap-2.5">
                  <Clock className="h-4 w-4 shrink-0 text-sky-600" />
                  Réponse garantie sous 24 h ouvrées
                </li>
                <li className="flex items-center gap-2.5">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-sky-600" />
                  Devis gratuit et sans engagement
                </li>
                <li className="flex items-center gap-2.5">
                  <Wrench className="h-4 w-4 shrink-0 text-sky-600" />
                  Techniciens formés à la pose Starlink
                </li>
                <li className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 shrink-0 text-sky-600" />
                  Douala, Yaoundé et alentours
                </li>
              </ul>
            </div>
            <a
              href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent("Bonjour, je souhaite un devis d'installation Starlink.")}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg bg-whatsapp-500 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" />
              Ou écrivez-nous directement
            </a>
            <p className="text-center text-xs text-muted-foreground">
              {contact.phone} — réponse rapide 7j/7
            </p>
          </aside>

          {/* Carte formulaire */}
          <div className="rounded-lg border bg-card p-5 shadow-sm sm:p-7 lg:col-span-2">
            <InstallationForm whatsapp={contact.whatsapp} />
          </div>
        </section>
      </div>
    </main>
  );
}
