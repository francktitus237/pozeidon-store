import { MapPin, Phone, MessageCircle, Clock, Headset } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { CONTACT } from "@/lib/constants";

export const metadata = {
  title: "Contact — Pozeidon Engineering",
};

const INFO_CARDS = [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: CONTACT.phone,
    hint: "Réponse sous 1 h en journée",
    href: `https://wa.me/${CONTACT.whatsapp}`,
    accent: "text-whatsapp-500",
  },
  {
    icon: Phone,
    title: "Téléphone",
    value: CONTACT.phone,
    hint: "Appels direct pendant les horaires",
    accent: "text-sky-600",
  },
  {
    icon: MapPin,
    title: "Zones couvertes",
    value: "Douala · Yaoundé · Kribi",
    hint: "Livraison et installation partout au Cameroun",
    accent: "text-sky-600",
  },
  {
    icon: Clock,
    title: "Horaires",
    value: "Lun – Sam : 8 h – 19 h",
    hint: "Dimanche : sur rendez-vous",
    accent: "text-sky-600",
  },
];

export default function ContactPage() {
  return (
    <main>
      {/* Bandeau */}
      <div className="bg-navy-900 px-4 py-12 text-center text-white">
        <Headset className="mx-auto mb-3 h-10 w-10 text-sky-300" />
        <h1 className="text-3xl font-bold">Contactez-nous</h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-sky-100">
          Une question sur un produit, une installation ou le suivi de votre
          commande ? Notre équipe vous répond rapidement.
        </p>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Cartes d'infos */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {INFO_CARDS.map((c) => (
            <div
              key={c.title}
              className="flex flex-col items-center gap-2 rounded-lg border bg-card p-5 text-center"
            >
              <c.icon className={`h-6 w-6 ${c.accent}`} />
              <p className="font-semibold text-navy-900">{c.title}</p>
              {c.href ? (
                <a
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-sky-600 hover:underline"
                >
                  {c.value}
                </a>
              ) : (
                <p className="text-sm">{c.value}</p>
              )}
              <p className="text-xs text-muted-foreground">{c.hint}</p>
            </div>
          ))}
        </div>

        {/* Formulaire */}
        <div className="mx-auto mt-10 max-w-2xl rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-navy-900">
            Envoyez-nous un message
          </h2>
          <p className="mb-5 mt-1 text-sm text-muted-foreground">
            Décrivez votre besoin — le message part directement sur notre
            WhatsApp.
          </p>
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
