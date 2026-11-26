"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { submitReview } from "@/features/reviews/actions";

export function ReviewForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!rating) {
      toast.add({
        title: "Note manquante",
        description: "Choisissez une note de 1 à 5 étoiles.",
        type: "error",
      });
      return;
    }
    const d = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await submitReview({
        productId,
        name: String(d.get("name") ?? ""),
        rating,
        text: String(d.get("text") ?? ""),
        website: String(d.get("website") ?? ""),
      });
      if (res.error) {
        toast.add({ title: "Erreur", description: res.error, type: "error" });
      } else {
        setDone(true);
      }
    });
  }

  if (done) {
    return (
      <p className="rounded-lg bg-sky-50 p-4 text-sm text-navy-900">
        Merci pour votre avis ! Il sera publié après validation par notre
        équipe.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      {/* Honeypot anti-spam — invisible pour les humains, les bots le remplissent */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute h-0 w-0 opacity-0"
      />
      <div
        className="flex gap-1"
        role="radiogroup"
        aria-label="Note sur 5 étoiles"
      >
        {Array.from({ length: 5 }).map((_, i) => {
          const value = i + 1;
          const active = value <= (hover || rating);
          return (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHover(value)}
              onMouseLeave={() => setHover(0)}
              aria-label={`${value} étoile${value > 1 ? "s" : ""}`}
              aria-pressed={rating === value}
              className="p-0.5"
            >
              <Star
                className={`h-6 w-6 transition-colors ${
                  active
                    ? "fill-cta-500 text-cta-500"
                    : "text-muted-foreground/40"
                }`}
              />
            </button>
          );
        })}
      </div>
      <Input name="name" required placeholder="Votre nom" maxLength={80} />
      <textarea
        name="text"
        required
        rows={3}
        minLength={5}
        maxLength={1000}
        placeholder="Votre avis sur ce produit…"
        className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-sky-500"
      />
      <div>
        <Button
          type="submit"
          disabled={pending}
          className="bg-navy-900 text-white hover:bg-navy-700"
        >
          {pending ? "Envoi…" : "Publier mon avis"}
        </Button>
      </div>
    </form>
  );
}
