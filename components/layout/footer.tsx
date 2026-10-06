import Link from "next/link";
import { MapPin, MessageCircle, Phone, Clock } from "lucide-react";
import { CATEGORIES, CONTACT, PAYMENT_METHODS, SITE_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-16 bg-navy-900 text-sky-100">
      <div className="container mx-auto grid gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* Marque */}
        <div>
          <p className="mb-3 text-lg font-bold text-white">{SITE_NAME}</p>
          <p className="text-sm leading-relaxed">
            Vente d&apos;équipement informatique et d&apos;accessoires Starlink
            au Cameroun. Maintenance, installation et livraison.
          </p>
          <div className="mt-4 space-y-2 text-sm">
            <a
              href={`https://wa.me/${CONTACT.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-white"
            >
              <MessageCircle className="h-4 w-4 text-whatsapp-500" />
              WhatsApp : {CONTACT.phone}
            </a>
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-sky-400" />
              Lun – Sam : 8h – 18h
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-sky-400" />
              {CONTACT.address}
            </p>
          </div>
        </div>

        {/* Catégories */}
        <div>
          <p className="mb-3 font-semibold text-white">Nos produits</p>
          <ul className="grid grid-cols-1 gap-2 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/boutique/${c.slug}`} className="hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Liens */}
        <div>
          <p className="mb-3 font-semibold text-white">Informations</p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/boutique" className="hover:text-white">
                Toute la boutique
              </Link>
            </li>
            <li>
              <Link href="/installation" className="hover:text-white">
                Installation certifiée
              </Link>
            </li>
            <li>
              <Link href="/compte" className="hover:text-white">
                Suivre ma commande
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-white">
                Nos services
              </Link>
            </li>
          </ul>
        </div>

        {/* Paiement & livraison */}
        <div>
          <p className="mb-3 font-semibold text-white">Paiement &amp; livraison</p>
          <ul className="space-y-1 text-sm">
            {PAYMENT_METHODS.map((p) => (
              <li key={p.id} className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-sky-400" />
                {p.label}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-sky-200/80">
            Livraison gratuite à Douala et Yaoundé. Expédition possible dans
            tout le Cameroun sur demande.
          </p>
        </div>
      </div>

      <div className="border-t border-navy-700 py-4">
        <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-4 text-xs sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE_NAME}. Tous droits réservés.</p>
          <p className="text-sky-200/70">
            Ordinateurs · Accessoires Starlink &amp; informatique ·
            Maintenance
          </p>
        </div>
      </div>
    </footer>
  );
}
