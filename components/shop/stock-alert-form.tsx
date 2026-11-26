"use client";

import { useState, useTransition } from "react";
import { Bell, Check, Loader2 } from "lucide-react";
import { subscribeStockAlert } from "@/features/stock-alerts/actions";

// Formulaire « Prévenez-moi » affiché quand l'article est épuisé :
// le client laisse son téléphone (+ email optionnel), on le relance
// au retour en stock au lieu de perdre la vente.
export function StockAlertForm({ productId }: { productId: string }) {
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await subscribeStockAlert({
        productId,
        phone: String(d.get("phone") ?? ""),
        email: String(d.get("email") ?? ""),
        website: String(d.get("website") ?? ""),
      });
      if (res.error) {
        setError(res.error);
      } else {
        setDone(true);
        setError("");
      }
    });
  }

  if (done) {
    return (
      <p className="flex items-center gap-2 rounded-lg border border-stock-in/30 bg-stock-in/10 px-4 py-3 text-sm font-medium text-stock-in">
        <Check className="h-4 w-4" />
        C&apos;est noté ! On vous prévient dès son retour.
      </p>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-2.5 rounded-lg border border-sky-200 bg-sky-50 p-4"
    >
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute h-0 w-0 opacity-0"
      />
      <p className="flex items-center gap-2 text-sm font-semibold text-navy-900">
        <Bell className="h-4 w-4 text-sky-600" />
        Prévenez-moi quand il revient
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="tel"
          name="phone"
          required
          placeholder="Votre téléphone (WhatsApp)"
          className="min-w-0 flex-1 rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none focus:border-sky-500"
        />
        <input
          type="email"
          name="email"
          placeholder="Email (optionnel)"
          className="min-w-0 flex-1 rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none focus:border-sky-500"
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-navy-700 disabled:opacity-50"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Bell className="h-4 w-4" />
          )}
          Me prévenir
        </button>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    </form>
  );
}
