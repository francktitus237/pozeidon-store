import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  getAnnouncement,
  getCookieBanner,
  getContact,
  getPaymentConfig,
} from "@/lib/settings";
import { BannerSettingsForm } from "@/components/admin/banner-settings-form";
import { CookieSettingsForm } from "@/components/admin/cookie-settings-form";
import { ContactSettingsForm } from "@/components/admin/contact-settings-form";
import { PaymentSettingsForm } from "@/components/admin/payment-settings-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await auth();
  if (!session) redirect("/connexion");

  const [announcement, cookieBanner, contact, payments] = await Promise.all([
    getAnnouncement(),
    getCookieBanner(),
    getContact(),
    getPaymentConfig(),
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
