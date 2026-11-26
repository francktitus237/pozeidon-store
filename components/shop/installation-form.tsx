"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  submitInstallation,
  type InstallationFormData,
} from "@/features/installations/actions";
import { CONTACT } from "@/lib/constants";
import { User, MapPin, Wrench, Camera, Loader2, X } from "lucide-react";

const inputCls =
  "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-sky-500";

const labelCls = "text-sm font-medium";

function SectionTitle({
  icon: Icon,
  children,
}: {
  icon: typeof User;
  children: React.ReactNode;
}) {
  return (
    <h3 className="flex items-center gap-2 border-b pb-2 text-sm font-semibold uppercase tracking-wide text-navy-900">
      <Icon className="h-4 w-4 text-sky-600" /> {children}
    </h3>
  );
}

export function InstallationForm({
  whatsapp = CONTACT.whatsapp,
}: {
  whatsapp?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [hasKit, setHasKit] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");

  function pickPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setPhoto(f);
    setPhotoPreview(f ? URL.createObjectURL(f) : "");
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const f = new FormData(e.currentTarget);
    startTransition(async () => {
      // 1) Upload de la photo du lieu (optionnelle) via la route publique
      let photoUrl = "";
      if (photo) {
        const fd = new FormData();
        fd.append("file", photo);
        try {
          const res = await fetch("/api/upload-public", {
            method: "POST",
            body: fd,
          });
          const json = (await res.json()) as { path?: string; error?: string };
          if (!res.ok || !json.path) {
            setError(json.error ?? "Photo impossible à envoyer — réessayez.");
            return;
          }
          photoUrl = json.path;
        } catch {
          setError("Photo impossible à envoyer — vérifiez votre connexion.");
          return;
        }
      }

      // 2) Envoi de la demande
      const data: InstallationFormData = {
        name: String(f.get("name")),
        phone: String(f.get("phone")),
        city: String(f.get("city")),
        district: String(f.get("district")),
        placeType: String(f.get("placeType")),
        hasKit: f.get("hasKit") === "on",
        kitType: String(f.get("kitType") || "") || undefined,
        preferredDate: String(f.get("preferredDate") || "") || undefined,
        description: String(f.get("description") || "") || undefined,
        photoUrl: photoUrl || undefined,
        website: String(f.get("website") || ""),
      };
      const res = await submitInstallation(data);
      if (res && "error" in res) {
        setError(res.error ?? "Données invalides, réessayez.");
        return;
      }
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

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {/* Coordonnées */}
      <section className="flex flex-col gap-4">
        <SectionTitle icon={User}>Vos coordonnées</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Nom complet *</label>
            <Input name="name" required placeholder="Votre nom" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Téléphone / WhatsApp *</label>
            <Input
              name="phone"
              required
              placeholder="6XX XX XX XX"
              inputMode="tel"
            />
            <p className="text-xs text-muted-foreground">
              Le numéro sur lequel on peut vous joindre sur WhatsApp.
            </p>
          </div>
        </div>
      </section>

      {/* Le lieu */}
      <section className="flex flex-col gap-4">
        <SectionTitle icon={MapPin}>Le lieu d&apos;installation</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Ville *</label>
            <Input name="city" required placeholder="Douala" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Quartier *</label>
            <Input name="district" required placeholder="Akwa, Bonapriso…" />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className={labelCls}>Type de lieu *</label>
            <select name="placeType" required className={inputCls}>
              <option value="">Choisir…</option>
              <option value="maison">Maison / Villa</option>
              <option value="appartement">Appartement</option>
              <option value="bureau">Bureau / Entreprise</option>
              <option value="commerce">Commerce / Boutique</option>
              <option value="hotel">Hôtel / Restaurant</option>
              <option value="ecole">École / ONG / Administration</option>
              <option value="autre">Autre</option>
            </select>
          </div>
        </div>
      </section>

      {/* Le besoin */}
      <section className="flex flex-col gap-4">
        <SectionTitle icon={Wrench}>Votre besoin</SectionTitle>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="hasKit"
            checked={hasKit}
            onChange={(e) => setHasKit(e.target.checked)}
          />
          J&apos;ai déjà un kit Starlink (sinon nous fournissons tout)
        </label>

        {hasKit && (
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Quel kit possédez-vous ?</label>
            <select name="kitType" className={inputCls}>
              <option value="">Je ne sais pas</option>
              <option value="standard">Starlink Standard</option>
              <option value="mini">Starlink Mini</option>
              <option value="high-performance">High Performance</option>
              <option value="autre">Autre modèle</option>
            </select>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>
            Date souhaitée d&apos;intervention (optionnel)
          </label>
          <input
            type="date"
            name="preferredDate"
            min={new Date().toISOString().split("T")[0]}
            className={inputCls}
          />
        </div>

        {/* Photo du lieu */}
        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>
            Photo du lieu (optionnel — toit, façade, poteau)
          </label>
          {photoPreview ? (
            <div className="relative w-fit">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoPreview}
                alt="Photo du lieu"
                className="h-32 rounded-lg border object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setPhoto(null);
                  setPhotoPreview("");
                }}
                aria-label="Retirer la photo"
                className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed px-3 py-3 text-sm text-muted-foreground transition hover:border-sky-400 hover:text-navy-900">
              <Camera className="h-4 w-4" />
              Ajouter une photo (aide le technicien à préparer le devis)
              <input
                type="file"
                accept="image/*"
                onChange={pickPhoto}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>
            Décrivez votre besoin (optionnel)
          </label>
          <textarea
            name="description"
            rows={3}
            placeholder="Accès toiture, hauteur du bâtiment, nombre de pièces…"
            className={inputCls}
          />
        </div>
      </section>

      {/* Honeypot anti-spam — invisible pour les humains */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button
        type="submit"
        disabled={pending}
        className="bg-navy-900 text-white hover:bg-navy-700"
      >
        {pending ? (
          <>
            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            Envoi en cours…
          </>
        ) : (
          "Demander un devis gratuit"
        )}
      </Button>
    </form>
  );
}
