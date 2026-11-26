"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { updateAnalyticsConfig } from "@/features/admin/settings-actions";
import type { AnalyticsConfig } from "@/lib/settings";

export function AnalyticsSettingsForm({ config }: { config: AnalyticsConfig }) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await updateAnalyticsConfig({ gaId: String(d.get("gaId") ?? "") });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } catch (err) {
        toast.add({
          title: "Erreur",
          description:
            err instanceof Error ? err.message : "Enregistrement impossible.",
          type: "error",
        });
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="ga-id" className="text-sm font-medium">
          ID de mesure Google Analytics 4
        </label>
        <Input
          id="ga-id"
          name="gaId"
          defaultValue={config.gaId}
          placeholder="G-XXXXXXXXXX"
          pattern="G-[A-Za-z0-9]{4,20}"
          className="max-w-xs font-mono"
        />
        <p className="text-xs text-muted-foreground">
          analytics.google.com → Admin → Flux de données → votre flux web →
          « ID de mesure ». Laissez vide pour désactiver le suivi.
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
