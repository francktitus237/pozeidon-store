"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";

interface Props {
  value: string;
  onChange: (url: string) => void;
  compact?: boolean;
}

/** Champ image : upload fichier via /api/upload + saisie d'URL possible */
export function ImageField({ value, onChange, compact }: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = (await res.json()) as { path?: string; error?: string };
      if (!res.ok || !json.path) throw new Error(json.error ?? "Échec");
      onChange(json.path);
    } catch {
      alert("Upload impossible. Réessayez ou collez une URL d'image.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {value ? (
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border bg-sky-50">
          <Image
            src={value}
            alt="Aperçu"
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="h-10 w-10 shrink-0 rounded-md border border-dashed bg-sky-50" />
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium hover:bg-sky-50 disabled:opacity-50"
      >
        <Upload className="h-3.5 w-3.5" />
        {uploading ? "Envoi…" : "Uploader"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void upload(f);
          e.target.value = "";
        }}
      />

      {!compact && (
        <input
          className="w-full rounded-md border bg-background px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
          placeholder="ou URL de l'image"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="shrink-0 rounded-md p-1 text-muted-foreground hover:text-destructive"
          aria-label="Retirer l'image"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
