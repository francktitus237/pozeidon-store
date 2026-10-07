"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Plus, Trash2, Pencil, FolderOpen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/features/admin/category-actions";

export interface CategoryRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image: string | null;
}

export function CategoryManager({ rows }: { rows: CategoryRow[] }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<CategoryRow | null>(null);

  function submit(e: React.FormEvent<HTMLFormElement>, editId?: string) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = new FormData(form);
    const input = {
      name: String(d.get("name") ?? ""),
      description: String(d.get("description") ?? ""),
      image: String(d.get("image") ?? ""),
    };
    startTransition(async () => {
      const res = editId
        ? await updateCategory(editId, input)
        : await createCategory(input);
      if (res.error) setError(res.error);
      else {
        setError("");
        setEditing(null);
        form.reset();
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Création */}
      <form
        onSubmit={(e) => submit(e)}
        className="flex flex-wrap items-end gap-3 rounded-lg border bg-card p-4"
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cat-name" className="text-sm font-medium">
            Nom de la catégorie
          </label>
          <Input
            id="cat-name"
            name="name"
            placeholder="Ex : Kits Starlink"
            className="w-52"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cat-desc" className="text-sm font-medium">
            Description (optionnel)
          </label>
          <Input id="cat-desc" name="description" className="w-64" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cat-image" className="text-sm font-medium">
            Image (URL)
          </label>
          <Input
            id="cat-image"
            name="image"
            placeholder="/images/categorie.jpg"
            className="w-56"
          />
        </div>
        <Button
          type="submit"
          disabled={pending}
          className="bg-navy-900 text-white hover:bg-navy-700"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Créer
        </Button>
        {error && !editing && (
          <p className="w-full text-sm text-red-600">{error}</p>
        )}
      </form>

      {/* Liste */}
      {rows.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border bg-card p-10 text-center text-sm text-muted-foreground">
          <FolderOpen className="h-8 w-8 opacity-40" />
          Aucune catégorie en base — les catégories par défaut sont utilisées.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((c) =>
            editing?.id === c.id ? (
              <form
                key={c.id}
                onSubmit={(e) => submit(e, c.id)}
                className="flex flex-col gap-3 rounded-lg border border-sky-300 bg-sky-50/50 p-4"
              >
                <div className="flex flex-wrap items-end gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Nom</label>
                    <Input
                      name="name"
                      defaultValue={c.name}
                      className="w-52"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Description</label>
                    <Input
                      name="description"
                      defaultValue={c.description ?? ""}
                      className="w-64"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Image</label>
                    <Input
                      name="image"
                      defaultValue={c.image ?? ""}
                      className="w-56"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="submit"
                    disabled={pending}
                    className="bg-navy-900 text-white hover:bg-navy-700"
                    size="sm"
                  >
                    Enregistrer
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEditing(null)}
                  >
                    <X className="mr-1 h-4 w-4" /> Annuler
                  </Button>
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
              </form>
            ) : (
              <div
                key={c.id}
                className="flex items-center gap-4 rounded-lg border bg-card p-4"
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-sky-50">
                  {c.image ? (
                    <Image
                      src={c.image}
                      alt={c.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <FolderOpen className="absolute inset-0 m-auto h-5 w-5 text-muted-foreground/40" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-navy-900">{c.name}</p>
                  <p className="text-xs text-muted-foreground">
                    /boutique/{c.slug}
                    {c.description ? ` · ${c.description}` : ""}
                  </p>
                </div>
                <button
                  disabled={pending}
                  onClick={() => {
                    setEditing(c);
                    setError("");
                  }}
                  className="rounded-md p-2 text-muted-foreground hover:bg-sky-50 hover:text-navy-900"
                  aria-label={`Modifier ${c.name}`}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  disabled={pending}
                  onClick={() => {
                    if (confirm(`Supprimer la catégorie « ${c.name} » ?`))
                      startTransition(async () => {
                        const res = await deleteCategory(c.id);
                        if (res.error) setError(res.error);
                      });
                  }}
                  className="rounded-md p-2 text-muted-foreground hover:bg-red-50 hover:text-red-600"
                  aria-label={`Supprimer ${c.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )
          )}
        </div>
      )}
      {error && editing === null && rows.length > 0 && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
