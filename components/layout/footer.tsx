import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  MessageCircle,
  Phone,
  Clock,
  Truck,
  ShieldCheck,
  Headphones,
  CreditCard,
} from "lucide-react";
import { PAYMENT_METHODS, SITE_NAME } from "@/lib/constants";
import { getContact } from "@/lib/settings";
import { getCategories } from "@/features/products/queries";

export async function Footer() {
  const [contact, categories] = await Promise.all([
    getContact(),
    getCategories(),
  ]);

  const tel = contact.whatsapp.replace(/\s/g, "");

  return (
    <footer className="mt-16 bg-navy-950 text-sky-100">
      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-14">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Marque & contact */}
          <div className="lg:col-span-5">
            <Link href="/" className="mb-5 inline-flex items-center gap-3">
              <Image
                src="/logo-mark.png"
                alt=""
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <span className="text-lg font-bold text-white">{SITE_NAME}</span>
            </Link>
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-sky-200/80">
              Vente d&apos;équipement informatique et d&apos;accessoires Starlink
              au Cameroun. Maintenance, installation et livraison rapide.
            </p>

            <div className="space-y-3 text-sm">
              <a
                href={`https://wa.me/${contact.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors group-hover:bg-whatsapp-500">
                  <MessageCircle className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs text-sky-300">WhatsApp</p>
                  <p className="text-white">{contact.phone}</p>
                </div>
              </a>

              <a href={`tel:${tel}`} className="group flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors group-hover:bg-sky-500">
                  <Phone className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs text-sky-300">Téléphone</p>
                  <p className="text-white">{contact.phone}</p>
                </div>
              </a>

              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
                  <Clock className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs text-sky-300">Horaires</p>
                  <p className="text-white">{contact.hours}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
                  <MapPin className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs text-sky-300">Adresse</p>
                  <p className="max-w-xs leading-snug text-white">
                    {contact.address}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Colonnes de liens */}
          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-4">
            {/* Catégories */}
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
                Nos produits
              </p>
              <ul className="space-y-2.5 text-sm">
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/boutique/${c.slug}`}
                      className={
                        c.slug === "promotions"
                          ? "font-medium text-cta-500 hover:text-cta-400"
                          : "text-sky-200/80 transition-colors hover:text-white"
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
              <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
                Informations
              </p>
              <ul className="space-y-2.5 text-sm">
                {[
                  { href: "/boutique", label: "Toute la boutique" },
                  { href: "/installation", label: "Installation certifiée" },
                  { href: "/compte", label: "Suivre ma commande" },
                  { href: "/services", label: "Nos services" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sky-200/80 transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Légal */}
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
                Légal
              </p>
              <ul className="space-y-2.5 text-sm">
                {[
                  { href: "/mentions-legales", label: "Mentions légales" },
                  { href: "/cgv", label: "Conditions de vente" },
                  { href: "/politique-confidentialite", label: "Confidentialité" },
                  { href: "/livraison-retours", label: "Livraison & retours" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sky-200/80 transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Paiement */}
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
                Paiement &amp; livraison
              </p>
              <ul className="space-y-2.5 text-sm">
                {PAYMENT_METHODS.map((p) => (
                  <li key={p.id} className="flex items-center gap-2">
                    <CreditCard className="h-3.5 w-3.5 text-sky-400" />
                    <span className="text-sky-200/80">{p.label}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-sky-300/70">
                Livraison gratuite à Douala et Yaoundé. Expédition possible dans
                tout le Cameroun sur demande.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Badges de confiance */}
      <div className="border-y border-white/10 bg-white/[0.03]">
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-6 text-center sm:grid-cols-3">
            <div>
              <Truck className="mx-auto mb-2 h-6 w-6 text-cta-500" />
              <p className="text-sm font-medium text-white">Livraison rapide</p>
              <p className="text-xs text-sky-300/70">
                Douala, Yaoundé et expédition nationale
              </p>
            </div>
            <div>
              <ShieldCheck className="mx-auto mb-2 h-6 w-6 text-cta-500" />
              <p className="text-sm font-medium text-white">Produits vérifiés</p>
              <p className="text-xs text-sky-300/70">
                Matériel contrôlé et garanti
              </p>
            </div>
            <div>
              <Headphones className="mx-auto mb-2 h-6 w-6 text-cta-500" />
              <p className="text-sm font-medium text-white">Support réactif</p>
              <p className="text-xs text-sky-300/70">
                Conseil et assistance technique
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="py-5">
        <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-4 text-center text-xs text-sky-300/70 sm:flex-row sm:text-left">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. Tous droits réservés.
          </p>
          <p>
            Conçu avec soin au Cameroun — Accessoires Starlink &amp; informatique
          </p>
        </div>
      </div>
    </footer>
  );
}
