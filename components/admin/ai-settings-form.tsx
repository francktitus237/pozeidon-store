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
      await updateAiConfig({
        geminiApiKey: String(d.get("geminiApiKey") ?? ""),
        model: String(d.get("model") ?? ""),
        ttsModel: String(d.get("ttsModel") ?? ""),
        ttsVoice: String(d.get("ttsVoice") ?? ""),
      });
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
          enregistrée, l&apos;assistant client et le bouton « Générer avec
          l&apos;IA » s&apos;activent.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ai-model" className="text-sm font-medium">
            Modèle chat
          </label>
          <Input
            id="ai-model"
            name="model"
            defaultValue={config.model}
            placeholder="gemini-3.5-flash-lite"
            className="font-mono text-xs"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ai-tts-model" className="text-sm font-medium">
            Modèle voix (TTS)
          </label>
          <Input
            id="ai-tts-model"
            name="ttsModel"
            defaultValue={config.ttsModel}
            placeholder="gemini-2.5-flash-preview-tts"
            className="font-mono text-xs"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ai-tts-voice" className="text-sm font-medium">
            Voix
          </label>
          <Input
            id="ai-tts-voice"
            name="ttsVoice"
            defaultValue={config.ttsVoice}
            placeholder="Aoede"
            className="font-mono text-xs"
          />
        </div>
      </div>
      <p className="-mt-2 text-xs text-muted-foreground">
        Laissez les valeurs par défaut si vous ne savez pas — elles sont déjà
        pré-remplies avec les modèles actuels de Google.
      </p>
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
