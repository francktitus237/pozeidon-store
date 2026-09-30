import Link from "next/link";
import { CATEGORIES, CONTACT, PAYMENT_METHODS, SITE_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-16 bg-navy-900 text-sky-100">
      <div className="container mx-auto grid gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="mb-3 font-bold text-white">{SITE_NAME}</p>
          <p className="text-sm">
            Matériel et accessoires Starlink, livrés et installés partout au
            Cameroun.
          </p>
        </div>

        <div>
          <p className="mb-3 font-semibold text-white">Boutique</p>
          <ul className="space-y-2 text-sm">
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link href={`/boutique/${c.slug}`} className="hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 font-semibold text-white">Services</p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/installation" className="hover:text-white">
                Installation certifiée
              </Link>
            </li>
            <li>Service client — WhatsApp {CONTACT.phone}</li>
          </ul>
        </div>

        <div>
          <p className="mb-3 font-semibold text-white">Paiements acceptés</p>
          <ul className="space-y-1 text-sm">
            {PAYMENT_METHODS.map((p) => (
              <li key={p.id}>{p.label}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-navy-700 py-4 text-center text-xs">
        © {new Date().getFullYear()} {SITE_NAME}. Tous droits réservés.
      </div>
    </footer>
  );
}
