"use client";

import { useTransition } from "react";
import { Star, Check, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { toDate } from "@/lib/dates";
import { approveReview, deleteReview } from "@/features/reviews/actions";
import { PaginatedDiv } from "@/components/admin/paginated-table";
import type { AdminReview } from "@/features/reviews/queries";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < rating ? "fill-cta-500 text-cta-500" : "text-muted-foreground/40"
          }`}
        />
      ))}
    </span>
  );
}

export function ReviewManager({ rows }: { rows: AdminReview[] }) {
  const [pending, startTransition] = useTransition();

  const waiting = rows.filter((r) => !r.approved);
  const published = rows.filter((r) => r.approved);

  function onApprove(r: AdminReview) {
    startTransition(async () => {
      await approveReview(r.id);
      toast.add({
        title: "Avis publié",
        description: `${r.name} — ${r.productName ?? ""}`,
        type: "success",
      });
    });
  }

  function onDelete(r: AdminReview) {
    startTransition(async () => {
      await deleteReview(r.id);
      toast.add({
        title: "Avis supprimé",
        description: `${r.name} — ${r.productName ?? ""}`,
        type: "success",
      });
    });
  }

  function ReviewCard({ r }: { r: AdminReview }) {
    return (
      <div className="flex items-start justify-between gap-4 rounded-lg border bg-card p-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-navy-900">{r.name}</p>
            <Stars rating={r.rating} />
            <span className="text-xs text-muted-foreground">
              sur{" "}
              <span className="font-medium">
                {r.productName ?? "article supprimé"}
              </span>
            </span>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">{r.text}</p>
          <p className="mt-1.5 text-xs text-muted-foreground/70">
            {toDate(r.createdAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex shrink-0 gap-1">
          {!r.approved && (
            <button
              onClick={() => onApprove(r)}
              disabled={pending}
              aria-label="Publier"
              title="Publier"
              className="rounded-md p-1.5 text-stock-in hover:bg-sky-50"
            >
              <Check className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => onDelete(r)}
            disabled={pending}
            aria-label="Supprimer"
            title="Supprimer"
            className="rounded-md p-1.5 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-navy-900">Avis clients</h1>
        {waiting.length > 0 && (
          <Badge className="bg-cta-500 text-white">
            {waiting.length} en attente
          </Badge>
        )}
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          En attente de validation
        </h2>
        {waiting.length === 0 ? (
          <p className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
            Aucun avis en attente.
          </p>
        ) : (
          <PaginatedDiv>
            {waiting.map((r) => <ReviewCard key={r.id} r={r} />)}
          </PaginatedDiv>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Publiés
        </h2>
        {published.length === 0 ? (
          <p className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
            Aucun avis publié pour le moment.
          </p>
        ) : (
          <PaginatedDiv>
            {published.map((r) => <ReviewCard key={r.id} r={r} />)}
          </PaginatedDiv>
        )}
      </section>
    </div>
  );
}
