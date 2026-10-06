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
  { slug: "ordinateurs", label: "Ordinateurs", icon: Monitor },
  { slug: "accessoires-starlink", label: "Starlink", icon: Antenna },
  {
    slug: "accessoires-informatique",
    label: "Accessoires",
    icon: Keyboard,
  },
  { slug: "services", label: "Services", icon: Wrench, href: "/services" },
  { slug: "promotions", label: "Promos", icon: Tag },
  {
    slug: "boutique",
    label: "Tout",
    icon: LayoutGrid,
    href: "/boutique",
  },
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
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-sky-300 bg-sky-50 text-navy-900 transition-colors hover:bg-sky-100">
            <s.icon className="h-6 w-6" />
          </span>
          <span className="text-center text-xs font-medium">{s.label}</span>
        </Link>
      ))}
    </div>
  );
}
