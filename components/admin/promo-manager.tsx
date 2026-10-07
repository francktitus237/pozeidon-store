"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createPromoCode,
  togglePromoCode,
  deletePromoCode,
} from "@/features/admin/promo-actions";

export interface PromoRow {
  id: string;
  code: string;
  percent: number;
  active: boolean;
  maxUses: number | null;
  usedCount: number;
}

export function PromoManager({ rows }: { rows: PromoRow[] }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function onCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = new FormData(form);
    const maxRaw = String(d.get("maxUses") ?? "").trim();
    startTransition(async () => {
      const res = await createPromoCode({
        code: String(d.get("code") ?? ""),
        percent: Number(d.get("percent")),
        maxUses: maxRaw ? Number(maxRaw) : undefined,
      });
      if (res.error) {
        setError(res.error);
      } else {
        setError("");
        form.reset();
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Création */}
      <form
        onSubmit={onCreate}
        className="flex flex-wrap items-end gap-3 rounded-lg border bg-card p-4"
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="p-code" className="text-sm font-medium">
            Code
          </label>
          <Input
            id="p-code"
            name="code"
            placeholder="BIENVENUE10"
            className="w-40 uppercase"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="p-percent" className="text-sm font-medium">
            Remise (%)
          </label>
          <Input
            id="p-percent"
            name="percent"
            type="number"
            min={1}
            max={90}
            placeholder="10"
            className="w-24"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="p-max" className="text-sm font-medium">
            Utilisations max (optionnel)
          </label>
          <Input
            id="p-max"
            name="maxUses"
            type="number"
            min={1}
            placeholder="Illimité"
            className="w-36"
          />
        </div>
        <Button
          type="submit"
          disabled={pending}
          className="bg-navy-900 text-white hover:bg-navy-700"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Créer le code
        </Button>
        {error && <p className="w-full text-sm text-red-600">{error}</p>}
      </form>

      {/* Liste */}
      {rows.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border bg-card p-10 text-center text-sm text-muted-foreground">
          <Tag className="h-8 w-8 opacity-40" />
          Aucun code promo. Créez-en un pour lancer une offre marketing.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-sky-50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Remise</th>
                <th className="px-4 py-3">Utilisations</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-mono font-bold">{p.code}</td>
                  <td className="px-4 py-3">-{p.percent}%</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {p.usedCount}
                    {p.maxUses != null ? ` / ${p.maxUses}` : " / ∞"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      disabled={pending}
                      onClick={() =>
                        startTransition(async () => {
                          await togglePromoCode(p.id, !p.active);
                        })
                      }
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        p.active
                          ? "bg-stock-in/15 text-stock-in"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {p.active ? "Actif" : "Désactivé"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      disabled={pending}
                      onClick={() => {
                        if (confirm(`Supprimer le code ${p.code} ?`))
                          startTransition(async () => {
                            await deletePromoCode(p.id);
                          });
                      }}
                      className="rounded-md p-2 text-muted-foreground hover:bg-red-50 hover:text-red-600"
                      aria-label={`Supprimer ${p.code}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
