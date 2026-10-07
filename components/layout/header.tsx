import Link from "next/link";
import Image from "next/image";
import { User } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";
import {
  getAnnouncement,
  getAnnouncementBg,
  getContact,
} from "@/lib/settings";
import { WhatsAppButton } from "./whatsapp-button";
import { MobileNav } from "./mobile-nav";
import { CartButton } from "./cart-button";
import { SearchBar } from "./search-bar";

const NAV_LINKS = [
  { href: "/boutique", label: "Boutique" },
  { href: "/services", label: "Services" },
  { href: "/installation", label: "Installation" },
  { href: "/entreprises", label: "Entreprises" },
  { href: "/contact", label: "Contact" },
];

export async function Header() {
  const [announcement, contact] = await Promise.all([
    getAnnouncement(),
    getContact(),
  ]);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      {/* Barre d'annonce personnalisable */}
      {announcement.enabled && (
        <div
          className={`${getAnnouncementBg(
            announcement.bg
          )} overflow-hidden py-1.5 text-xs text-white`}
        >
          <div className="animate-marquee flex w-max gap-12 whitespace-nowrap">
            {[0, 1].map((i) => (
              <span key={i} aria-hidden={i === 1} className="flex gap-12">
                {announcement.link ? (
                  <Link href={announcement.link} className="hover:underline">
                    {announcement.text}
                  </Link>
                ) : (
                  <span>{announcement.text}</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Barre principale */}
      <div className="container mx-auto flex h-16 items-center gap-3 px-4">
        <MobileNav />

        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image
            src="/logo-mark.png"
            alt={`Logo ${SITE_NAME}`}
            width={44}
            height={44}
            className="h-11 w-11 object-contain"
            priority
          />
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-base font-bold uppercase tracking-wide text-navy-900">
              Pozeidon
            </span>
            <span className="text-[11px] font-medium uppercase tracking-widest text-sky-600">
              Engineering
            </span>
          </span>
        </Link>

        {/* Recherche desktop */}
        <div className="mx-auto hidden w-full max-w-xl md:block">
          <SearchBar />
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <WhatsAppButton phone={contact.whatsapp} />
          <Link
            href="/compte"
            aria-label="Espace client"
            className="rounded-full p-2 transition-colors hover:bg-sky-100"
          >
            <User className="h-5 w-5 text-navy-900" />
          </Link>
          <CartButton />
        </div>
      </div>

      {/* Recherche mobile */}
      <div className="container mx-auto px-4 pb-3 md:hidden">
        <SearchBar placeholder="Rechercher…" />
      </div>

      {/* Ligne de navigation desktop */}
      <nav className="hidden border-t md:block">
        <div className="container mx-auto flex items-center justify-center gap-6 px-4">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="relative py-2 text-sm font-medium text-foreground transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-center after:scale-x-0 after:bg-cta-500 after:transition-transform hover:text-navy-900 hover:after:scale-x-100"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
