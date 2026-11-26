import { Star } from "lucide-react";
import { reviewStats, type Review } from "@/features/reviews/queries";
import { ReviewForm } from "./review-form";
import { toDate } from "@/lib/dates";

function Stars({ rating, size = "h-4 w-4" }: { rating: number; size?: string }) {
  return (
    <span className="flex gap-0.5" aria-label={`${rating}/5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${size} ${
            i < Math.round(rating)
              ? "fill-cta-500 text-cta-500"
              : "text-muted-foreground/40"
          }`}
        />
      ))}
    </span>
  );
}

export function ProductReviews({
  productId,
  reviews,
}: {
  productId: string;
  reviews: Review[];
}) {
  const { count, average } = reviewStats(reviews);

  return (
    <section className="mt-12">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-xl font-bold text-navy-900">Avis clients</h2>
        {count > 0 && (
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Stars rating={average} />
            {average}/5 · {count} avis
          </span>
        )}
      </div>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          {count === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucun avis pour le moment — soyez le premier à donner le vôtre.
            </p>
          ) : (
            reviews.map((r) => (
              <article
                key={r.id}
                className="rounded-lg border bg-card p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-navy-900">{r.name}</p>
                  <Stars rating={r.rating} />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
                <p className="mt-2 text-xs text-muted-foreground/70">
                  {toDate(r.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </article>
            ))
          )}
        </div>

        <div className="rounded-lg border bg-card p-5">
          <h3 className="mb-3 text-sm font-semibold text-navy-900">
            Laisser un avis
          </h3>
          <ReviewForm productId={productId} />
        </div>
      </div>
    </section>
  );
}
