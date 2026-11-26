"use client";

import { useTransition } from "react";
import { Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { toDate } from "@/lib/dates";
import {
  deleteSubscriber,
  updateNewsletterConfig,
} from "@/features/newsletter/actions";
import { PaginatedTable } from "@/components/admin/paginated-table";
import type { Subscriber } from "@/features/newsletter/queries";

export function NewsletterManager({
  rows,
  welcomeCode,
}: {
  rows: Subscriber[];
  welcomeCode: string;
}) {
  const [pending, startTransition] = useTransition();

  function onSaveWelcome(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const code = String(new FormData(e.currentTarget).get("welcomeCode") ?? "");
    startTransition(async () => {
      const res = await updateNewsletterConfig(code);
      if (res.error) {
        toast.add({ title: "Erreur", description: res.error, type: "error" });
      } else {
        toast.add({
          title: "Enregistré",
          description: code
            ? `Le code ${code.toUpperCase()} sera offert à chaque inscription.`
            : "Aucun code offert à l'inscription.",
          type: "success",
        });
      }
    });
  }

  function onDelete(s: Subscriber) {
    startTransition(async () => {
      await deleteSubscriber(s.id);
      toast.add({
        title: "Abonné supprimé",
        description: s.email,
        type: "success",
      });
    });
  }

  function exportCsv() {
    const lines = [
      "email;date_inscription",
      ...rows.map(
        (r) => `${r.email};${toDate(r.createdAt).toISOString().slice(0, 10)}`
      ),
    ];
    const blob = new Blob(["﻿" + lines.join("\n")], { // ﻿ = BOM pour Excel
      type: "text/csv;charset=utf-8",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "abonnes-newsletter.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Newsletter</h1>
          <p className="text-sm text-muted-foreground">
            {rows.length} abonné{rows.length > 1 ? "s" : ""} — exportez la liste
            pour vos campagnes email.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={exportCsv}
          disabled={!rows.length}
        >
          <Download className="h-4 w-4" />
          Exporter CSV
        </Button>
      </div>

      {/* Code promo offert à l'inscription */}
      <form
        onSubmit={onSaveWelcome}
        className="flex flex-wrap items-end gap-3 rounded-lg border bg-card p-4"
      >
        <div className="flex min-w-60 flex-1 flex-col gap-1.5">
          <label htmlFor="nl-code" className="text-sm font-medium">
            Code promo offert à l&apos;inscription (optionnel)
          </label>
          <Input
            id="nl-code"
            name="welcomeCode"
            defaultValue={welcomeCode}
            placeholder="BIENVENUE10"
            className="w-44 uppercase"
          />
          <p className="text-xs text-muted-foreground">
            Doit correspondre à un code existant dans Codes promo. Le visiteur
            le voit juste après s&apos;être inscrit — convertit l&apos;abonné
            en client.
          </p>
        </div>
        <Button
          type="submit"
          disabled={pending}
          className="bg-navy-900 text-white hover:bg-navy-700"
        >
          Enregistrer
        </Button>
      </form>

      {rows.length === 0 ? (
        <p className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
          Aucun abonné pour le moment. Le formulaire d’inscription est affiché
          dans le pied de page du site.
        </p>
      ) : (
        <PaginatedTable headers={["Email", "Inscrit le", ""]}>
          {rows.map((s) => (
            <tr key={s.id} className="border-b last:border-0">
              <td className="px-4 py-2.5 font-medium text-navy-900">
                {s.email}
              </td>
              <td className="px-4 py-2.5 text-muted-foreground">
                {toDate(s.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </td>
              <td className="px-4 py-2.5 text-right">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={pending}
                  onClick={() => onDelete(s)}
                  aria-label={`Supprimer ${s.email}`}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </td>
            </tr>
          ))}
        </PaginatedTable>
      )}
    </div>
  );
}
