import { LegalPage, legalMetadata } from "@/components/shop/legal-page";
import { SITE_NAME, CONTACT, PAYMENT_METHODS } from "@/lib/constants";

export const metadata = legalMetadata({
  title: "Conditions générales de vente",
  description: `Conditions générales de vente de ${SITE_NAME}.`,
});

export default function CgvPage() {
  return (
    <LegalPage
      title="Conditions générales de vente"
      description="Les règles qui encadrent nos ventes en ligne et nos prestations."
    >
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-navy-900">Préambule</h2>
        <p>
          Les présentes conditions générales de vente s&apos;appliquent à toutes les commandes passées sur le site de {SITE_NAME}. En validant une commande, le client accepte sans réserve les présentes CGV.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-navy-900">Produits et prix</h2>
        <p>
          Les produits proposés sont ceux figurant sur le site, dans la limite des stocks disponibles. Les prix sont indiqués en FCFA et peuvent être modifiés sans préavis. Les offres promotionnelles sont valables dans la limite des stocks disponibles et pour la durée affichée.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-navy-900">Commande</h2>
        <p>
          Le client sélectionne les produits et valide son panier. La commande est confirmée après acceptation du paiement ou, pour les commandes par WhatsApp, après validation écrite par {SITE_NAME}.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-navy-900">Paiement</h2>
        <p>Les moyens de paiement acceptés sont :</p>
        <ul className="list-inside list-disc space-y-1 pl-2">
          {PAYMENT_METHODS.map((m) => (
            <li key={m.id}>{m.label}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-navy-900">Livraison</h2>
        <p>
          Les produits sont livrés à l&apos;adresse indiquée par le client lors de la commande. Les délais annoncés sont donnés à titre indicatif. Les frais de livraison sont calculés en fonction de la ville et affichés avant validation.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-navy-900">Rétractation et retours</h2>
        <p>
          Les produits peuvent être retournés sous 7 jours ouvrables après réception, dans leur emballage d&apos;origine et en parfait état. Les produits sur mesure, les licences logicielles et les prestations de service ne sont pas éligibles au retour.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-navy-900">Garantie et service après-vente</h2>
        <p>
          Les produits bénéficient de la garantie légale du fabricant ou de l&apos;importateur. {SITE_NAME} assure un suivi SAV et met à disposition son service technique pour toute question.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-navy-900">Litiges</h2>
        <p>
          En cas de litige, une solution amiable sera recherchée en priorité. À défaut, les tribunaux compétents seront ceux du ressort du siège social de {SITE_NAME}.
        </p>
        <p className="text-sm">Contact : {CONTACT.phone} — WhatsApp : +{CONTACT.whatsapp}</p>
      </section>
    </LegalPage>
  );
}
