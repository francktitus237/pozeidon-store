"use client";

import { useState, useTransition } from "react";
import { updateCookieBanner } from "@/features/admin/settings-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CookieBanner } from "@/lib/settings";

interface Props {
  config: CookieBanner;
}

export function CookieSettingsForm({ config }: Props) {
  const [form, setForm] = useState(config);
  const [msg, setMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    startTransition(async () => {
      try {
        await updateCookieBanner(form);
        setMsg("Bannière cookies mise à jour avec succès.");
      } catch {
        setMsg("Erreur lors de la mise à jour.");
      }
    });
  }

  return (
    <form onSubmit={submit} className="max-w-xl space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Texte affiché</label>
        <Input
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Bouton accepter
          </label>
          <Input
            value={form.acceptLabel}
            onChange={(e) => setForm({ ...form, acceptLabel: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">
            Bouton refuser
          </label>
          <Input
            value={form.declineLabel}
            onChange={(e) => setForm({ ...form, declineLabel: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Lien politique de confidentialité (optionnel)
        </label>
        <Input
          value={form.policyLink ?? ""}
          onChange={(e) =>
            setForm({ ...form, policyLink: e.target.value || undefined })
          }
          placeholder="Ex : /a-propos"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="cookie-enabled"
          checked={form.enabled}
          onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
        />
        <label htmlFor="cookie-enabled" className="text-sm">
          Afficher la bannière cookies aux visiteurs
        </label>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Enregistrement…" : "Enregistrer"}
      </Button>

      {msg && (
        <p
          className={`text-sm ${
            msg.startsWith("Bannière") ? "text-green-600" : "text-destructive"
          }`}
        >
          {msg}
        </p>
      )}
    </form>
  );
}
