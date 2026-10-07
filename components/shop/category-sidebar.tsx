import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getCategories } from "@/features/products/queries";

export async function CategorySidebar() {
  const categories = await getCategories();
  return (
    <nav
      aria-label="Catégories"
      className="hidden w-56 shrink-0 rounded-lg border bg-card lg:block"
    >
      <p className="border-b px-4 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
        Catégories
      </p>
      <ul>
        {categories.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/boutique/${c.slug}`}
              className="flex items-center justify-between px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-sky-50 hover:text-navy-900"
            >
              {c.name}
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
