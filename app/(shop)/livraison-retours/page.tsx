import { LegalPage, legalMetadata } from "@/components/shop/legal-page";
import { SITE_NAME, CONTACT } from "@/lib/constants";

export const metadata = legalMetadata({
  title: "Livraison et retours",
  description: `Modalités de livraison et de retour chez ${SITE_NAME}.`,
});

export default function LivraisonRetoursPage() {
  return (
    <LegalPage
      title="Livraison et retours"
      description="Tout savoir sur la livraison de vos commandes et notre politique de retour."
    >
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-navy-900">Zones de livraison</h2>
        <p>
          Nous assurons la livraison dans les principales villes du Cameroun. La livraison est gratuite à Douala et Yaoundé pour les commandes éligibles. Pour les autres localisations, les frais sont calculés lors de la commande.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-navy-900">Délais de livraison</h2>
        <p>
          Les délais varient selon la disponibilité du produit et la ville de destination. En règle générale, comptez 24 à 72 heures pour Douala et Yaoundé, et 3 à 7 jours ouvrables pour les autres villes.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-navy-900">Suivi de commande</h2>
        <p>
          Une fois votre commande validée, vous recevrez une confirmation par WhatsApp ou SMS. Vous pouvez également suivre votre commande depuis votre espace client ou en nous contactant directement.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-navy-900">Retours</h2>
        <p>
          Vous disposez de 7 jours ouvrables après réception pour nous signaler tout problème ou demander un retour. Le produit doit être dans son emballage d&apos;origine, complet et en parfait état de revente.
        </p>
        <p>
          Les produits personnalisés, les licences activées et les services déjà réalisés ne sont pas éligibles au retour.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-navy-900">Contact</h2>
        <p>
          Pour toute question concernant la livraison ou un retour, contactez-nous par WhatsApp au +{CONTACT.whatsapp} ou par téléphone au {CONTACT.phone}.
        </p>
      </section>
    </LegalPage>
  );
}
