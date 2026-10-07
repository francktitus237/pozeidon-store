"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitInstallation } from "@/features/installations/actions";
import { CONTACT } from "@/lib/constants";

export function InstallationForm({
  whatsapp = CONTACT.whatsapp,
}: {
  whatsapp?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const data: Parameters<typeof submitInstallation>[0] = {
      name: String(f.get("name")),
      phone: String(f.get("phone")),
      city: String(f.get("city")),
      district: String(f.get("district")),
      placeType: String(f.get("placeType")),
      hasKit: f.get("hasKit") === "on",
      description: String(f.get("description") || ""),
    };
    startTransition(async () => {
      await submitInstallation(data);
      setSent(true);
    });
  }

  if (sent) {
    const msg = encodeURIComponent(
      "Bonjour, je viens d'envoyer une demande d'installation sur votre site."
    );
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg border border-stock-in/40 bg-stock-in/5 p-8 text-center">
        <p className="text-lg font-semibold text-stock-in">
          Demande envoyée ✓
        </p>
        <p className="max-w-md text-sm text-muted-foreground">
          Notre équipe vous contactera sous 24 h pour planifier
          l&apos;intervention. Vous pouvez aussi nous écrire directement.
        </p>
        <a
          href={`https://wa.me/${whatsapp}?text=${msg}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg bg-whatsapp-500 px-5 py-2.5 font-medium text-white hover:opacity-90"
        >
          Confirmer sur WhatsApp
        </a>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-sky-500";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Nom complet *</label>
          <Input name="name" required placeholder="Votre nom" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Téléphone / WhatsApp *</label>
          <Input name="phone" required placeholder="6XX XX XX XX" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Ville *</label>
          <Input name="city" required placeholder="Douala" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Quartier *</label>
          <Input name="district" required placeholder="Akwa, Bonapriso…" />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-sm font-medium">Type de lieu *</label>
          <select name="placeType" required className={inputCls}>
            <option value="">Choisir…</option>
            <option value="maison">Maison / Villa</option>
            <option value="appartement">Appartement</option>
            <option value="bureau">Bureau / Entreprise</option>
            <option value="hotel">Hôtel / Restaurant</option>
            <option value="autre">Autre</option>
          </select>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="hasKit" />
        J&apos;ai déjà un kit Starlink (sinon nous fournissons tout)
      </label>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">
          Décrivez votre besoin (optionnel)
        </label>
        <textarea
          name="description"
          rows={3}
          placeholder="Accès toiture, hauteur du bâtiment, nombre de pièces…"
          className={inputCls}
        />
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="bg-navy-900 text-white hover:bg-navy-700"
      >
        {pending ? "Envoi…" : "Demander un devis gratuit"}
      </Button>
    </form>
  );
}
