import Link from "next/link";
import {
  Monitor,
  Antenna,
  Keyboard,
  Wrench,
  Tag,
  LayoutGrid,
} from "lucide-react";

const SHORTCUTS = [
  { slug: "ordinateurs-neufs", label: "Ordinateurs", icon: Monitor },
  { slug: "accessoires-starlink", label: "Starlink", icon: Antenna },
  {
    slug: "accessoires-informatique",
    label: "Accessoires",
    icon: Keyboard,
  },
  { slug: "services", label: "Services", icon: Wrench, href: "/services" },
  {
    slug: "boutique",
    label: "Tout",
    icon: LayoutGrid,
    href: "/boutique",
  },
  { slug: "promotions", label: "Promos", icon: Tag, promo: true },
];

export function QuickCategories() {
  return (
    <div className="flex gap-4 overflow-x-auto px-1 py-2 md:justify-center">
      {SHORTCUTS.map((s) => (
        <Link
          key={s.slug}
          href={s.href ?? `/boutique/${s.slug}`}
          className="flex w-20 shrink-0 flex-col items-center gap-2"
        >
          <span
            className={`flex h-14 w-14 items-center justify-center rounded-full border transition-colors ${
              "promo" in s && s.promo
                ? "border-cta-500 bg-cta-500 text-white shadow-md hover:bg-cta-600"
                : "border-sky-300 bg-sky-50 text-navy-900 hover:bg-sky-100"
            }`}
          >
            <s.icon className="h-6 w-6" />
          </span>
          <span
            className={`text-center text-xs ${
              "promo" in s && s.promo ? "font-bold text-cta-600" : "font-medium"
            }`}
          >
            {s.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
