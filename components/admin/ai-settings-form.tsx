"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateAiConfig } from "@/features/admin/settings-actions";
import type { AiConfig } from "@/lib/settings";

export function AiSettingsForm({ config }: { config: AiConfig }) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    startTransition(async () => {
      await updateAiConfig({ geminiApiKey: String(d.get("geminiApiKey") ?? "") });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="ai-key" className="text-sm font-medium">
          Clé API Gemini (gratuite)
        </label>
        <Input
          id="ai-key"
          name="geminiApiKey"
          type="password"
          defaultValue={config.geminiApiKey}
          placeholder="AIza…"
          autoComplete="off"
          className="max-w-md font-mono"
        />
        <p className="text-xs text-muted-foreground">
          aistudio.google.com → « Get API key » (gratuit). Une fois la clé
          enregistrée, le formulaire article affiche le bouton « Générer avec
          l&apos;IA » qui rédige la description pour vous.
        </p>
      </div>
      <div>
        <Button
          type="submit"
          disabled={pending}
          className="bg-navy-900 text-white hover:bg-navy-700"
        >
          {pending ? "Enregistrement…" : saved ? "Enregistré ✓" : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
