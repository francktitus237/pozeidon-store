"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateEmailConfig } from "@/features/admin/settings-actions";
import type { EmailConfig } from "@/lib/settings";

export function EmailSettingsForm({ config }: { config: EmailConfig }) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    startTransition(async () => {
      await updateEmailConfig({
        resendApiKey: String(d.get("resendApiKey") ?? ""),
        fromEmail: String(d.get("fromEmail") ?? ""),
        orderConfirmationEnabled: d.get("enabled") === "on",
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="e-key" className="text-sm font-medium">
            Clé API Resend
          </label>
          <Input
            id="e-key"
            name="resendApiKey"
            type="password"
            defaultValue={config.resendApiKey}
            placeholder="re_xxxxxxxxxxxx"
            autoComplete="off"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="e-from" className="text-sm font-medium">
            Adresse d&apos;expédition
          </label>
          <Input
            id="e-from"
            name="fromEmail"
            type="email"
            defaultValue={config.fromEmail}
            placeholder="boutique@votre-domaine.com"
          />
        </div>
      </div>

      <label className="flex items-center gap-2.5 text-sm">
        <input
          type="checkbox"
          name="enabled"
          defaultChecked={config.orderConfirmationEnabled}
          className="h-4 w-4 accent-navy-900"
        />
        Envoyer un email de confirmation au client à chaque commande (s&apos;il
        a renseigné un email)
      </label>

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
