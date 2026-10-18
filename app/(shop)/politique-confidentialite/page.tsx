import { LegalPage, legalMetadata } from "@/components/shop/legal-page";
import { SITE_NAME, CONTACT } from "@/lib/constants";

export const metadata = legalMetadata({
  title: "Politique de confidentialité",
  description: `Comment ${SITE_NAME} protège vos données personnelles.`,
});

export default function PolitiqueConfidentialitePage() {
  return (
    <LegalPage
      title="Politique de confidentialité"
      description="Transparence sur la collecte, l&apos;utilisation et la protection de vos données."
    >
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-navy-900">Qui sommes-nous ?</h2>
        <p>
          Le site {SITE_NAME} est édité par {SITE_NAME}. Nous collectons uniquement les données nécessaires au traitement de vos commandes et à la qualité de notre relation client.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-navy-900">Données collectées</h2>
        <p>Nous collectons les données que vous nous fournissez volontairement :</p>
        <ul className="list-inside list-disc space-y-1 pl-2">
          <li>nom, prénom et numéro de téléphone ;</li>
          <li>adresse de livraison et informations complémentaires ;</li>
          <li>historique de commandes et préférences ;</li>
          <li>messages échangés via WhatsApp ou le formulaire de contact.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-navy-900">Utilisation des données</h2>
        <p>Vos données sont utilisées pour :</p>
        <ul className="list-inside list-disc space-y-1 pl-2">
          <li>traiter et livrer vos commandes ;</li>
          <li>vous contacter en cas de besoin ;</li>
          <li>améliorer nos services ;</li>
          <li>respecter nos obligations légales et comptables.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-navy-900">Cookies</h2>
        <p>
          Le site utilise des cookies techniques nécessaires à son fonctionnement (panier, préférences d&apos;affichage) et, avec votre consentement, des cookies de mesure d&apos;audience. Vous pouvez modifier vos choix à tout moment via le bandeau cookies.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-navy-900">Conservation</h2>
        <p>
          Les données sont conservées pendant la durée nécessaire aux finalités poursuivies et conformément aux obligations légales en vigueur au Cameroun.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-navy-900">Vos droits</h2>
        <p>
          Vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données. Pour exercer ces droits, contactez-nous via WhatsApp au +{CONTACT.whatsapp} ou par téléphone au {CONTACT.phone}.
        </p>
      </section>
    </LegalPage>
  );
}
