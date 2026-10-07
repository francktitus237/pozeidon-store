"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updatePaymentConfig } from "@/features/admin/settings-actions";
import type { PaymentConfig } from "@/lib/settings";

export function PaymentSettingsForm({ config }: { config: PaymentConfig }) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [momoEnabled, setMomoEnabled] = useState(config.momoEnabled);
  const [orangeEnabled, setOrangeEnabled] = useState(config.orangeEnabled);
  const [codEnabled, setCodEnabled] = useState(config.codEnabled);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    startTransition(async () => {
      await updatePaymentConfig({
        momoEnabled,
        momoNumber: String(d.get("momoNumber") ?? "").replace(/\D/g, ""),
        momoInstructions: String(d.get("momoInstructions") ?? ""),
        orangeEnabled,
        orangeNumber: String(d.get("orangeNumber") ?? "").replace(/\D/g, ""),
        orangeInstructions: String(d.get("orangeInstructions") ?? ""),
        codEnabled,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  }

  const toggle = (checked: boolean, set: (v: boolean) => void) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => set(e.target.checked)}
      className="h-4 w-4 accent-navy-900"
    />
  );

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {/* MTN Mobile Money */}
      <div className="rounded-lg border p-4">
        <label className="flex items-center gap-2.5 text-sm font-semibold">
          {toggle(momoEnabled, setMomoEnabled)}
          MTN Mobile Money
        </label>
        {momoEnabled && (
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="momo-num" className="text-sm font-medium">
                Numéro marchand MTN
              </label>
              <Input
                id="momo-num"
                name="momoNumber"
                defaultValue={config.momoNumber}
                placeholder="237696XXXXXX"
                inputMode="tel"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="momo-instr" className="text-sm font-medium">
                Instructions affichées au client
              </label>
              <Input
                id="momo-instr"
                name="momoInstructions"
                defaultValue={config.momoInstructions}
              />
            </div>
          </div>
        )}
      </div>

      {/* Orange Money */}
      <div className="rounded-lg border p-4">
        <label className="flex items-center gap-2.5 text-sm font-semibold">
          {toggle(orangeEnabled, setOrangeEnabled)}
          Orange Money
        </label>
        {orangeEnabled && (
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="om-num" className="text-sm font-medium">
                Numéro marchand Orange
              </label>
              <Input
                id="om-num"
                name="orangeNumber"
                defaultValue={config.orangeNumber}
                placeholder="237695XXXXXX"
                inputMode="tel"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="om-instr" className="text-sm font-medium">
                Instructions affichées au client
              </label>
              <Input
                id="om-instr"
                name="orangeInstructions"
                defaultValue={config.orangeInstructions}
              />
            </div>
          </div>
        )}
      </div>

      {/* Paiement à la livraison */}
      <div className="rounded-lg border p-4">
        <label className="flex items-center gap-2.5 text-sm font-semibold">
          {toggle(codEnabled, setCodEnabled)}
          Paiement à la livraison
        </label>
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
