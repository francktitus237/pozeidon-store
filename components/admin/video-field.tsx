"use client";

import { useRef, useState } from "react";
import { Upload, X, Film } from "lucide-react";

interface Props {
  value: string;
  onChange: (url: string) => void;
}

/** Champ vidéo : upload de fichier .mp4/.webm/.mov via /api/upload + saisie d'URL */
export function VideoField({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setUploading(true);
    setProgress(0);
    try {
      const fd = new FormData();
      fd.append("file", file);
      // XHR plutôt que fetch pour suivre la progression (fichiers lourds)
      const path = await new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/upload");
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable)
            setProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
          try {
            const json = JSON.parse(xhr.responseText) as {
              path?: string;
              error?: string;
            };
            if (xhr.status === 200 && json.path) resolve(json.path);
            else reject(new Error(json.error ?? `Erreur ${xhr.status}`));
          } catch {
            reject(new Error("Réponse invalide"));
          }
        };
        xhr.onerror = () => reject(new Error("Erreur réseau"));
        xhr.send(fd);
      });
      onChange(path);
    } catch (err) {
      alert(
        err instanceof Error
          ? `Upload impossible : ${err.message}`
          : "Upload impossible. Réessayez ou collez une URL (YouTube, .mp4…)."
      );
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {value ? (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-navy-900">
          <Film className="h-4 w-4 text-sky-300" />
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
        {uploading ? `Envoi… ${progress}%` : "Uploader"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void upload(f);
          e.target.value = "";
        }}
      />

      <input
        className="w-full rounded-md border bg-background px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
        placeholder="ou URL YouTube / .mp4"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="shrink-0 rounded-md p-1 text-muted-foreground hover:text-destructive"
          aria-label="Retirer la vidéo"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
