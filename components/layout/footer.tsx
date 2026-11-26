import Link from "next/link";
import Image from "next/image";
import { MapPin, MessageCircle, Phone, Clock, CreditCard } from "lucide-react";
import { PAYMENT_METHODS, SITE_NAME } from "@/lib/constants";
import { getContact, getSocialConfig } from "@/lib/settings";
import { getVisibleCategories } from "@/features/products/queries";
import { NewsletterForm } from "./newsletter-form";

// Icônes de marques — retirées de lucide-react, donc SVG inline.
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export async function Footer() {
  const [contact, categories, social] = await Promise.all([
    getContact(),
    getVisibleCategories(),
    getSocialConfig(),
  ]);
  const tel = contact.whatsapp.replace(/\s/g, "");

  return (
    <footer className="mt-12 bg-navy-900 text-sky-50">
      <div className="container mx-auto px-4 py-10">
        {/* Newsletter */}
        <div className="mb-8 flex flex-col gap-3 border-b border-navy-700 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Newsletter</p>
            <p className="text-sm text-sky-100/80">
              Nouveautés et promotions directement dans votre boîte mail.
            </p>
          </div>
          <NewsletterForm />
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Marque & coordonnées */}
          <div className="lg:col-span-2">
            <Link href="/" className="mb-3 inline-flex items-center gap-2">
              <Image
                src="/logo-mark.png"
                alt=""
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="text-base font-bold text-white">
                {SITE_NAME}
              </span>
            </Link>
            <p className="mb-4 max-w-sm text-sm leading-relaxed text-sky-100/80">
              Vente d&apos;équipement informatique et d&apos;accessoires Starlink
              au Cameroun. Maintenance, installation et livraison.
            </p>

            <div className="space-y-2 text-sm text-sky-100">
              <a
                href={`tel:${tel}`}
                className="flex items-center gap-2 transition-colors hover:text-white"
              >
                <Phone className="h-4 w-4 text-sky-400" />
                {contact.phone}
              </a>
              <a
                href={`https://wa.me/${contact.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-white"
              >
                <MessageCircle className="h-4 w-4 text-whatsapp-500" />
                WhatsApp
              </a>
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-sky-400" />
                {contact.hours}
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-sky-400" />
                <span className="leading-snug">{contact.address}</span>
              </p>
            </div>

            {(social.facebookUrl || social.instagramUrl) && (
              <div className="mt-4 flex items-center gap-3">
                {social.facebookUrl && (
                  <a
                    href={social.facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook"
                    className="rounded-full bg-navy-700 p-2 text-sky-100 transition-colors hover:bg-sky-600 hover:text-white"
                  >
                    <FacebookIcon className="h-4 w-4" />
                  </a>
                )}
                {social.instagramUrl && (
                  <a
                    href={social.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    className="rounded-full bg-navy-700 p-2 text-sky-100 transition-colors hover:bg-sky-600 hover:text-white"
                  >
                    <InstagramIcon className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Nos produits */}
          <div>
            <p className="mb-3 text-sm font-semibold text-white">Nos produits</p>
            <ul className="space-y-2 text-sm text-sky-100">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/boutique/${c.slug}`}
                    className={
                      c.slug === "promotions"
                        ? "font-medium text-cta-500 hover:text-cta-400"
                        : "transition-colors hover:text-white"
                    }
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informations */}
          <div>
            <p className="mb-3 text-sm font-semibold text-white">Informations</p>
            <ul className="space-y-2 text-sm text-sky-100">
              {[
                { href: "/boutique", label: "Toute la boutique" },
                { href: "/installation", label: "Installation certifiée" },
                { href: "/compte", label: "Suivre ma commande" },
                { href: "/services", label: "Nos services" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Légal & paiement */}
          <div>
            <p className="mb-3 text-sm font-semibold text-white">Légal</p>
            <ul className="mb-4 space-y-2 text-sm text-sky-100">
              {[
                { href: "/mentions-legales", label: "Mentions légales" },
                { href: "/cgv", label: "Conditions de vente" },
                { href: "/politique-confidentialite", label: "Confidentialité" },
                { href: "/livraison-retours", label: "Livraison & retours" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="mb-2 text-sm font-semibold text-white">Paiement</p>
            <ul className="space-y-1.5 text-sm text-sky-100">
              {PAYMENT_METHODS.map((p) => (
                <li key={p.id} className="flex items-center gap-2">
                  <CreditCard className="h-3.5 w-3.5 text-sky-400" />
                  {p.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-navy-700 py-4">
        <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-4 text-center text-xs text-sky-100/70 sm:flex-row sm:text-left">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. Tous droits réservés.
          </p>
          <p>Accessoires Starlink &amp; informatique — Cameroun</p>
        </div>
      </div>
    </footer>
  );
}
