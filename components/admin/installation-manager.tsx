"use client";

import { useState, useTransition } from "react";
import {
  MessageCircle,
  Calendar,
  MapPin,
  Home,
  Package,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PaginatedUl } from "@/components/admin/paginated-table";
import { updateInstallationStatus } from "@/features/installations/actions";
import { toDate } from "@/lib/dates";

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  new: { label: "Nouvelle", className: "bg-stock-order text-white" },
  quoted: { label: "Devis envoyé", className: "bg-sky-500 text-white" },
  scheduled: { label: "Planifiée", className: "bg-navy-500 text-white" },
  done: { label: "Terminée", className: "bg-stock-in text-white" },
  cancelled: { label: "Annulée", className: "bg-stock-out text-white" },
};

const PLACE_LABEL: Record<string, string> = {
  maison: "Maison / Villa",
  appartement: "Appartement",
  bureau: "Bureau / Entreprise",
  commerce: "Commerce / Boutique",
  hotel: "Hôtel / Restaurant",
  ecole: "École / ONG / Administration",
  autre: "Autre",
};

const KIT_LABEL: Record<string, string> = {
  standard: "Starlink Standard",
  mini: "Starlink Mini",
  "high-performance": "High Performance",
  autre: "Autre modèle",
};

export interface InstallationRow {
  id: string;
  name: string;
  phone: string;
  city: string;
  district: string;
  placeType: string;
  hasKit: boolean;
  kitType: string | null;
  preferredDate: string | null;
  description: string | null;
  photoUrl: string | null;
  status: string;
  createdAt: Date | string | number;
}

export function InstallationManager({ rows }: { rows: InstallationRow[] }) {
  const [pending, startTransition] = useTransition();
  const [statuses, setStatuses] = useState<Record<string, string>>({});

  function changeStatus(id: string, status: string) {
    setStatuses((s) => ({ ...s, [id]: status }));
    startTransition(async () => {
      const res = await updateInstallationStatus(id, status);
      if (res && "error" in res) {
        setStatuses((s) => ({ ...s, [id]: "" }));
      }
    });
  }

  return (
    <PaginatedUl pageSize={10}>
      {rows.map((r) => {
        const status = statuses[r.id] || r.status;
        const s = STATUS_LABEL[status] ?? STATUS_LABEL.new;
        const waText = encodeURIComponent(
          `Bonjour ${r.name.split(" ")[0]}, nous avons bien reçu votre demande d'installation Starlink à ${r.city} (${r.district}).`
        );
        return (
          <li key={r.id} className="flex flex-col gap-3 px-4 py-4">
            {/* Ligne principale */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-navy-900">{r.name}</p>
                <p className="text-xs text-muted-foreground">
                  {toDate(r.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <a
                href={`https://wa.me/${r.phone.replace(/\D/g, "").replace(/^(\d{9})$/, "237$1")}?text=${waText}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-md bg-whatsapp-500 px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                {r.phone}
              </a>
              <Badge className={s.className}>{s.label}</Badge>
              <select
                value={status}
                disabled={pending}
                onChange={(e) => changeStatus(r.id, e.target.value)}
                className="rounded-md border bg-background px-2 py-1.5 text-xs outline-none focus:border-sky-500"
              >
                {Object.entries(STATUS_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Détails */}
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {r.district}, {r.city}
              </span>
              <span className="flex items-center gap-1">
                <Home className="h-3.5 w-3.5" />{" "}
                {PLACE_LABEL[r.placeType] ?? r.placeType}
              </span>
              <span className="flex items-center gap-1">
                <Package className="h-3.5 w-3.5" />{" "}
                {r.hasKit
                  ? `Kit client : ${KIT_LABEL[r.kitType ?? ""] ?? "modèle inconnu"}`
                  : "Kit à fournir"}
              </span>
              {r.preferredDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> Souhaitée :{" "}
                  {new Date(`${r.preferredDate}T12:00`).toLocaleDateString(
                    "fr-FR",
                    { day: "numeric", month: "long" }
                  )}
                </span>
              )}
            </div>

            {(r.description || r.photoUrl) && (
              <div className="flex items-start gap-4">
                {r.description && (
                  <p className="flex-1 text-xs text-muted-foreground">
                    <FileText className="mr-1 inline h-3.5 w-3.5" />
                    {r.description}
                  </p>
                )}
                {r.photoUrl && (
                  <a href={r.photoUrl} target="_blank" rel="noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={r.photoUrl}
                      alt="Photo du lieu"
                      className="h-16 w-24 rounded-md border object-cover hover:opacity-80"
                    />
                  </a>
                )}
              </div>
            )}
          </li>
        );
      })}
    </PaginatedUl>
  );
}
