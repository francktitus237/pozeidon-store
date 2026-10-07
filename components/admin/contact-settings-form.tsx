"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateContact } from "@/features/admin/settings-actions";
import type { ContactInfo } from "@/lib/settings";

export function ContactSettingsForm({ contact }: { contact: ContactInfo }) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    startTransition(async () => {
      await updateContact({
        whatsapp: String(d.get("whatsapp") ?? ""),
        phone: String(d.get("phone") ?? ""),
        address: String(d.get("address") ?? ""),
        hours: String(d.get("hours") ?? ""),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="c-whatsapp" className="text-sm font-medium">
            Numéro WhatsApp (format international)
          </label>
          <Input
            id="c-whatsapp"
            name="whatsapp"
            defaultValue={contact.whatsapp}
            placeholder="237696179594"
            required
          />
          <p className="text-xs text-muted-foreground">
            Utilisé par tous les boutons WhatsApp du site.
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="c-phone" className="text-sm font-medium">
            Téléphone affiché
          </label>
          <Input
            id="c-phone"
            name="phone"
            defaultValue={contact.phone}
            placeholder="6 96 17 95 94"
            required
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="c-address" className="text-sm font-medium">
          Adresse
        </label>
        <Input
          id="c-address"
          name="address"
          defaultValue={contact.address}
          placeholder="Akwa, Rue Equinoxe — Douala"
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="c-hours" className="text-sm font-medium">
          Horaires affichés
        </label>
        <Input
          id="c-hours"
          name="hours"
          defaultValue={contact.hours}
          placeholder="Lun – Sam : 8h – 18h"
          required
        />
      </div>
      <div className="flex items-center gap-3">
        <Button
          type="submit"
          disabled={pending}
          className="bg-navy-900 text-white hover:bg-navy-700"
        >
          {pending ? "Enregistrement…" : "Enregistrer"}
        </Button>
        {saved && (
          <span className="text-sm font-medium text-stock-in">
            Enregistré ✓
          </span>
        )}
      </div>
    </form>
  );
}
