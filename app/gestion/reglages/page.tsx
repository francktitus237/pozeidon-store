import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { promoCodes } from "@/lib/db/schema";
import {
  getAnnouncement,
  getCookieBanner,
  getContact,
  getPaymentConfig,
  getSocialConfig,
  getTariffs,
} from "@/lib/settings";
import { BannerSettingsForm } from "@/components/admin/banner-settings-form";
import { CookieSettingsForm } from "@/components/admin/cookie-settings-form";
import { ContactSettingsForm } from "@/components/admin/contact-settings-form";
import { PaymentSettingsForm } from "@/components/admin/payment-settings-form";
import { SocialSettingsForm } from "@/components/admin/social-settings-form";
import { TariffsSettingsForm } from "@/components/admin/tariffs-settings-form";
import { PromoManager } from "@/components/admin/promo-manager";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await auth();
  if (!session) redirect("/connexion");

  const [announcement, cookieBanner, contact, payments, tariffs, social, promos] =
    await Promise.all([
      getAnnouncement(),
      getCookieBanner(),
      getContact(),
      getPaymentConfig(),
      getTariffs(),
      getSocialConfig(),
      db.select().from(promoCodes).orderBy(promoCodes.createdAt),
    ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-navy-900">Réglages</h1>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-1 text-lg font-semibold text-navy-900">
          Coordonnées du site
        </h2>
        <p className="mb-5 text-sm text-muted-foreground">
          Numéro WhatsApp, téléphone, adresse et horaires affichés partout sur
          le site (header, footer, page contact, boutons WhatsApp).
        </p>
        <ContactSettingsForm contact={contact} />
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-1 text-lg font-semibold text-navy-900">
          Réseaux sociaux
        </h2>
        <p className="mb-5 text-sm text-muted-foreground">
          Connectez votre Page Facebook et votre compte Instagram pour publier
          automatiquement vos articles sur les réseaux. Chaque post contient la
          photo, le prix et le lien vers la fiche produit du site.
        </p>
        <SocialSettingsForm config={social} />
        <p className="mt-5 rounded-md bg-muted p-3 text-xs leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Catalogue WhatsApp / boutiques Meta :</strong>{" "}
          votre flux produits est disponible à l&apos;adresse{" "}
          <code className="rounded bg-background px-1">/api/feed</code> —
          ajoutez cette URL comme « flux de données » dans Meta Commerce
          Manager pour synchroniser vos articles vers le catalogue WhatsApp
          Business, la boutique Facebook et Instagram Shopping (gratuit).
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-1 text-lg font-semibold text-navy-900">
          Méthodes de paiement
        </h2>
        <p className="mb-5 text-sm text-muted-foreground">
          Activez les moyens de paiement acceptés au checkout et renseignez vos
          numéros marchands. Ils sont affichés au client pendant la commande.
        </p>
        <PaymentSettingsForm config={payments} />
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-1 text-lg font-semibold text-navy-900">
          Livraison &amp; installation
        </h2>
        <p className="mb-5 text-sm text-muted-foreground">
          Frais de livraison par ville (0 = gratuit) proposés au panier et au
          checkout, et forfaits d&apos;installation affichés sur les fiches produit
          éligibles. Laissez un prix vide pour « sur devis ».
        </p>
        <TariffsSettingsForm config={tariffs} />
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-1 text-lg font-semibold text-navy-900">
          Codes promo
        </h2>
        <p className="mb-5 text-sm text-muted-foreground">
          Créez des codes de réduction pour les campagnes marketing. Les clients
          peuvent les utiliser au checkout.
        </p>
        <PromoManager rows={promos} />
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-1 text-lg font-semibold text-navy-900">
          Bannière d&apos;annonce
        </h2>
        <p className="mb-5 text-sm text-muted-foreground">
          Texte affiché dans la barre animée en haut de chaque page. Vous pouvez
          ajouter un lien et changer la couleur.
        </p>
        <BannerSettingsForm announcement={announcement} />
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-1 text-lg font-semibold text-navy-900">
          Bannière cookies
        </h2>
        <p className="mb-5 text-sm text-muted-foreground">
          Bandeau de consentement affiché aux nouveaux visiteurs. Le choix est
          mémorisé dans leur navigateur.
        </p>
        <CookieSettingsForm config={cookieBanner} />
      </div>
    </div>
  );
}
