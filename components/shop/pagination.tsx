import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Pagination des grilles boutique — navigation par liens (?page=N),
// compatible avec les pages dynamiques filtrées par searchParams.
export function ShopPagination({
  page,
  totalPages,
  hrefFor,
}: {
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const btn =
    "rounded-md border px-3 py-1.5 text-sm transition hover:border-sky-400";
  const active = "border-navy-900 bg-navy-900 text-white hover:border-navy-900";

  // Pages numérotées avec ellipses : 1 … p-1 p p+1 … total
  const nums: (number | "…")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
      nums.push(i);
    } else if (nums[nums.length - 1] !== "…") {
      nums.push("…");
    }
  }

  return (
    <nav className="mt-8 flex items-center justify-center gap-1.5">
      {page > 1 && (
        <Link href={hrefFor(page - 1)} className={btn} aria-label="Page précédente">
          <ChevronLeft className="h-4 w-4" />
        </Link>
      )}
      {nums.map((n, i) =>
        n === "…" ? (
          <span key={`e${i}`} className="px-1 text-sm text-muted-foreground">
            …
          </span>
        ) : (
          <Link
            key={n}
            href={hrefFor(n)}
            className={`${btn} ${n === page ? active : ""}`}
          >
            {n}
          </Link>
        )
      )}
      {page < totalPages && (
        <Link href={hrefFor(page + 1)} className={btn} aria-label="Page suivante">
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </nav>
  );
}
