"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  Upload,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { formatPrice } from "@/lib/constants";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  type ProductFormData,
} from "@/features/admin/actions";

type Row = {
  id: string;
  name: string;
  reference: string;
  description: string | null;
  price: number;
  promoPrice: number | null;
  stock: number;
  status: string;
  categoryId: string;
  images: unknown;
  installationAvailable: boolean;
};

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  in_stock: { label: "En stock", className: "bg-stock-in text-white" },
  on_order: { label: "Sur commande", className: "bg-stock-order text-white" },
  out_of_stock: { label: "Épuisé", className: "bg-stock-out text-white" },
};
export function ProductManager({
  rows,
  categories,
}: {
  rows: Row[];
  categories: { id: string; name: string }[];
}) {
  const PAGE_SIZE = 8;
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = rows.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.reference.toLowerCase().includes(search.toLowerCase())
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageRows = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const [editing, setEditing] = useState<Row | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleting, setDeleting] = useState<Row | null>(null);
  const [imagePath, setImagePath] = useState("");
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();

  function openCreate() {
    setEditing(null);
    setImagePath("");
    setShowForm(true);
  }

  function openEdit(row: Row) {
    setEditing(row);
    setImagePath((row.images as string[] | null)?.[0] ?? "");
    setShowForm(true);
  }

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = (await res.json()) as { path?: string; error?: string };
      if (!res.ok || !json.path) throw new Error(json.error ?? "Échec");
      setImagePath(json.path);
      toast.add({ title: "Image téléversée", type: "success" });
    } catch (err) {
      toast.add({
        title: "Upload impossible",
        description: err instanceof Error ? err.message : undefined,
        type: "error",
      });
    } finally {
      setUploading(false);
    }
  }

  function onDeleteConfirm() {
    if (!deleting) return;
    const row = deleting;
    setDeleting(null);
    startTransition(async () => {
      await deleteProduct(row.id);
      toast.add({
        title: "Article supprimé",
        description: row.name,
        type: "success",
      });
    });
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const data: ProductFormData = {
      name: String(f.get("name")),
      reference: String(f.get("reference")),
      description: String(f.get("description") || ""),
      price: Number(f.get("price")),
      promoPrice: f.get("promoPrice") ? Number(f.get("promoPrice")) : null,
      stock: Number(f.get("stock")),
      status: String(f.get("status")),
      categoryId: String(f.get("categoryId")),
      image: imagePath,
      installationAvailable: f.get("installationAvailable") === "on",
    };
    startTransition(async () => {
      try {
        if (editing) {
          await updateProduct(editing.id, data);
          toast.add({ title: "Article mis à jour", description: data.name, type: "success" });
        } else {
          await createProduct(data);
          toast.add({ title: "Article créé", description: data.name, type: "success" });
        }
        setShowForm(false);
      } catch {
        toast.add({ title: "Erreur", description: "L'opération a échoué", type: "error" });
      }
    });
  }

  const inputCls =
    "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-sky-500";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy-900">Articles</h1>
        <Button
          onClick={openCreate}
          className="bg-cta-500 text-white hover:bg-cta-600"
        >
          <Plus className="mr-1 h-4 w-4" /> Nouvel article
        </Button>
      </div>

      {/* Popup formulaire article */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Modifier l'article" : "Nouvel article"}
            </DialogTitle>
            <DialogDescription>
              Renseignez les informations du produit.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Nom *</label>
              <Input
                name="name"
                required
                defaultValue={editing?.name}
                placeholder="Câble Starlink 45 m"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Référence *</label>
              <Input
                name="reference"
                required
                defaultValue={editing?.reference}
                placeholder="PZ-CB45"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Catégorie *</label>
              <select
                name="categoryId"
                required
                defaultValue={editing?.categoryId ?? ""}
                className={inputCls}
              >
                <option value="" disabled>
                  Choisir…
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Statut</label>
              <select
                name="status"
                defaultValue={editing?.status ?? "in_stock"}
                className={inputCls}
              >
                <option value="in_stock">En stock</option>
                <option value="on_order">Sur commande</option>
                <option value="out_of_stock">Épuisé</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Prix (FCFA) *</label>
              <Input
                name="price"
                type="number"
                min={0}
                required
                defaultValue={editing?.price ?? ""}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Prix promo (FCFA)</label>
              <Input
                name="promoPrice"
                type="number"
                min={0}
                defaultValue={editing?.promoPrice ?? ""}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Stock *</label>
              <Input
                name="stock"
                type="number"
                min={0}
                required
                defaultValue={editing?.stock ?? 0}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Image</label>
              <div className="flex items-center gap-3">
                {imagePath ? (
                  <Image
                    src={imagePath}
                    alt="Aperçu"
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-md object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-md bg-sky-100" />
                )}
                <label className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-sky-50">
                  <Upload className="h-4 w-4" />
                  {uploading ? "Envoi…" : "Choisir un fichier"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void uploadImage(file);
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Description</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={editing?.description ?? ""}
              className={inputCls}
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="installationAvailable"
              defaultChecked={editing?.installationAvailable}
            />
            Installation disponible avec ce produit
          </label>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={pending || uploading}
                className="bg-navy-900 text-white hover:bg-navy-700"
              >
                {pending
                  ? "Enregistrement…"
                  : editing
                    ? "Mettre à jour"
                    : "Créer"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Annuler
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Popup confirmation suppression */}
      <Dialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Supprimer cet article ?</DialogTitle>
            <DialogDescription>
              {deleting?.name} — cette action est définitive.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Annuler
            </Button>
            <Button
              onClick={onDeleteConfirm}
              disabled={pending}
              className="bg-destructive text-white hover:opacity-90"
            >
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Recherche */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Rechercher un article…"
            className="pl-9"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {filtered.length} article{filtered.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Article</th>
              <th className="px-4 py-3 font-medium">Référence</th>
              <th className="px-4 py-3 font-medium">Prix</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => {
              const s = STATUS_LABEL[p.status] ?? STATUS_LABEL.in_stock;
              const img = (p.images as string[] | null)?.[0];
              return (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="flex items-center gap-3 px-4 py-3">
                    {img ? (
                      <Image
                        src={img}
                        alt={p.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-md bg-sky-100" />
                    )}
                    <span className="font-medium">{p.name}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {p.reference}
                  </td>
                  <td className="px-4 py-3">
                    {p.promoPrice ? (
                      <span>
                        <span className="font-semibold text-cta-600">
                          {formatPrice(p.promoPrice)}
                        </span>{" "}
                        <span className="text-xs text-muted-foreground line-through">
                          {formatPrice(p.price)}
                        </span>
                      </span>
                    ) : (
                      formatPrice(p.price)
                    )}
                  </td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">
                    <Badge className={s.className}>{s.label}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEdit(p)}
                        aria-label="Modifier"
                        className="rounded-md p-1.5 text-sky-600 hover:bg-sky-50"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleting(p)}
                        disabled={pending}
                        aria-label="Supprimer"
                        className="rounded-md p-1.5 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Précédent
          </Button>
          <p className="text-sm text-muted-foreground">
            Page {currentPage} / {pageCount}
          </p>
          <Button
            variant="outline"
            disabled={currentPage >= pageCount}
            onClick={() => setPage((p) => p + 1)}
          >
            Suivant <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
