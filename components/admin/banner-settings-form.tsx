"use client";

import { useState, useTransition } from "react";
import { updateAnnouncement } from "@/features/admin/settings-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Announcement } from "@/lib/settings";

interface Props {
  announcement: Announcement;
}

export function BannerSettingsForm({ announcement }: Props) {
  const [form, setForm] = useState(announcement);
  const [msg, setMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    startTransition(async () => {
      try {
        await updateAnnouncement(form);
        setMsg("Bannière mise à jour avec succès.");
      } catch {
        setMsg("Erreur lors de la mise à jour.");
      }
    });
  }

  return (
    <form onSubmit={submit} className="max-w-xl space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Texte de la bannière</label>
        <Input
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Lien (optionnel)
        </label>
        <Input
          value={form.link ?? ""}
          onChange={(e) =>
            setForm({ ...form, link: e.target.value || undefined })
          }
          placeholder="Ex : /boutique"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Couleur</label>
        <div className="flex gap-3">
          {(["navy", "sky", "cta"] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setForm({ ...form, bg: c })}
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                form.bg === c ? "border-slate-900" : "border-transparent"
              } ${
                c === "navy"
                  ? "bg-navy-900"
                  : c === "sky"
                  ? "bg-sky-600"
                  : "bg-cta-500"
              }`}
              aria-label={c}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="enabled"
          checked={form.enabled}
          onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
        />
        <label htmlFor="enabled" className="text-sm">
          Afficher la bannière
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
