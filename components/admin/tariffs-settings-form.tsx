"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { updateTariffs } from "@/features/admin/settings-actions";
import type { TariffsConfig } from "@/lib/settings";

const inputCls =
  "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-sky-500";

export function TariffsSettingsForm({ config }: { config: TariffsConfig }) {
  const [cities, setCities] = useState<{ name: string; fee: number }[]>(
    Object.entries(config.deliveryCities).map(([name, fee]) => ({
      name,
      fee,
    }))
  );
  const [installation, setInstallation] = useState(config.installation);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateTariffs({
        deliveryCities: Object.fromEntries(
          cities
            .filter((c) => c.name.trim())
            .map((c) => [c.name.trim(), Math.max(0, Math.round(c.fee || 0))])
        ),
        installation: installation
          .filter((o) => o.label.trim())
          .map((o) => ({
            key: o.key,
            label: o.label.trim(),
            price: o.price == null ? null : Math.max(0, Math.round(o.price)),
          })),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* Frais de livraison */}
      <div>
        <p className="mb-2 text-sm font-semibold text-navy-900">
          Frais de livraison par ville
        </p>
        <div className="space-y-2">
          {cities.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                className={`${inputCls} flex-1`}
                placeholder="Ville (ex : Douala)"
                value={c.name}
                onChange={(e) =>
                  setCities((l) =>
                    l.map((x, j) => (j === i ? { ...x, name: e.target.value } : x))
                  )
                }
              />
              <input
                type="number"
                min={0}
                className={`${inputCls} w-32`}
                placeholder="0"
                value={c.fee}
                onChange={(e) =>
                  setCities((l) =>
                    l.map((x, j) =>
                      j === i ? { ...x, fee: Number(e.target.value) } : x
                    )
                  )
                }
              />
              <button
                type="button"
                aria-label="Supprimer"
                className="rounded-md p-2 text-red-500 hover:bg-red-50"
                onClick={() => setCities((l) => l.filter((_, j) => j !== i))}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="mt-2 flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm text-sky-700 hover:bg-sky-50"
          onClick={() => setCities((l) => [...l, { name: "", fee: 0 }])}
        >
          <Plus className="h-4 w-4" /> Ajouter une ville
        </button>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Frais en FCFA — 0 = livraison gratuite. Une ville non listée se
          verra proposée au checkout avec un montant nul.
        </p>
      </div>

      {/* Forfaits d'installation */}
      <div className="border-t pt-5">
        <p className="mb-2 text-sm font-semibold text-navy-900">
          Forfaits d'installation
        </p>
        <div className="space-y-2">
          {installation.map((o, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                className={`${inputCls} flex-1`}
                placeholder="Libellé (ex : Toiture simple)"
                value={o.label}
                onChange={(e) =>
                  setInstallation((l) =>
                    l.map((x, j) =>
                      j === i ? { ...x, label: e.target.value } : x
                    )
                  )
                }
              />
              <input
                type="number"
                min={0}
                className={`${inputCls} w-32`}
                placeholder="Sur devis"
                value={o.price ?? ""}
                onChange={(e) =>
                  setInstallation((l) =>
                    l.map((x, j) =>
                      j === i
                        ? {
                            ...x,
                            price:
                              e.target.value === ""
                                ? null
                                : Number(e.target.value),
                          }
                        : x
                    )
                  )
                }
              />
              <button
                type="button"
                aria-label="Supprimer"
                className="rounded-md p-2 text-red-500 hover:bg-red-50"
                onClick={() =>
                  setInstallation((l) => l.filter((_, j) => j !== i))
                }
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="mt-2 flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm text-sky-700 hover:bg-sky-50"
          onClick={() =>
            setInstallation((l) => [
              ...l,
              { key: `option_${l.length + 1}`, label: "", price: null },
            ])
          }
        >
          <Plus className="h-4 w-4" /> Ajouter un forfait
        </button>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Laissez le prix vide pour afficher « sur devis » au lieu d'un
          montant sur la fiche produit.
        </p>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="rounded-md bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
      >
        {saving ? "Enregistrement…" : saved ? "✓ Enregistré" : "Enregistrer"}
      </button>
    </form>
  );
}
