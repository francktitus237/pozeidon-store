import { LegalPage, legalMetadata } from "@/components/shop/legal-page";
import { SITE_NAME, CONTACT } from "@/lib/constants";

export const metadata = legalMetadata({
  title: "Mentions légales",
  description: `Informations légales concernant le site ${SITE_NAME}.`,
});

export default function MentionsLegalesPage() {
  return (
    <LegalPage
      title="Mentions légales"
      description="Informations réglementaires concernant notre site et notre activité."
    >
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-navy-900">Éditeur du site</h2>
        <p>
          Le site est édité par <strong>{SITE_NAME}</strong>, dont le siège social est situé à : {CONTACT.address}.
        </p>
        <p>
          Téléphone : {CONTACT.phone} — WhatsApp : +{CONTACT.whatsapp}
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-navy-900">Directeur de publication</h2>
        <p>Le directeur de publication est le représentant légal de {SITE_NAME}.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-navy-900">Hébergement</h2>
        <p>
          Le site est hébergé sur l&apos;infrastructure cloud du prestataire technique choisi par {SITE_NAME}. L&apos;adresse et les coordonnées de l&apos;hébergeur peuvent être communiquées sur demande.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-navy-900">Propriété intellectuelle</h2>
        <p>
          L&apos;ensemble des éléments constituant le site (textes, photographies, logos, icônes, mise en page, etc.) est la propriété exclusive de {SITE_NAME} ou fait l&apos;objet d&apos;une autorisation d&apos;utilisation. Toute reproduction ou représentation, totale ou partielle, sans autorisation expresse est interdite.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-navy-900">Responsabilité</h2>
        <p>
          {SITE_NAME} s&apos;efforce d&apos;assurer l&apos;exactitude et la mise à jour des informations diffusées sur le site. Toutefois, elle ne saurait garantir l&apos;absence d&apos;erreurs ou d&apos;omissions et décline toute responsabilité en cas d&apos;indisponibilité temporaire du site.
        </p>
      </section>
    </LegalPage>
  );
}
