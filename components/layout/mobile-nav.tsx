"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, ChevronRight, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SITE_NAME } from "@/lib/constants";

const LINKS = [
  { href: "/boutique", label: "Boutique" },
  { href: "/services", label: "Services" },
  { href: "/installation", label: "Installation" },
  { href: "/entreprises", label: "Entreprises" },
  { href: "/a-propos", label: "À propos" },
  { href: "/compte", label: "Espace client" },
  { href: "/contact", label: "Contact" },
];

export function MobileNav({
  categories,
}: {
  categories: { slug: string; name: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="md:hidden"
        aria-label="Ouvrir le menu"
      >
        <Menu className="h-6 w-6" />
      </SheetTrigger>
      <SheetContent side="left" className="flex w-72 flex-col overflow-y-auto p-0">
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <Image
              src="/logo-mark.png"
              alt={`Logo ${SITE_NAME}`}
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
            <span className="font-bold text-navy-900">{SITE_NAME}</span>
          </div>
          <Link
            href="/compte"
            onClick={() => setOpen(false)}
            aria-label="Espace client"
            className="rounded-full p-2 hover:bg-sky-50"
          >
            <User className="h-5 w-5 text-navy-900" />
          </Link>
        </div>

        <nav className="flex flex-col p-2">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-sky-50"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex-1 pb-4">
          <p className="border-t px-4 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Catégories
          </p>
          <nav className="flex flex-col px-2">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/boutique/${c.slug}`}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm hover:bg-sky-50 hover:text-navy-900"
              >
                {c.name}
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
