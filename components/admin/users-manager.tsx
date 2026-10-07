"use client";

import { useState, useTransition } from "react";
import { UserPlus, Trash2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createAdminUser,
  deleteAdminUser,
} from "@/features/admin/users-actions";

interface UserRow {
  id: string;
  username: string;
  createdAt: string;
}

export function UsersManager({
  rows,
  envUser,
}: {
  rows: UserRow[];
  envUser: string;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function onCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = new FormData(form);
    startTransition(async () => {
      const res = await createAdminUser({
        username: String(d.get("username") ?? ""),
        password: String(d.get("password") ?? ""),
      });
      if (res.error) setError(res.error);
      else {
        setError("");
        form.reset();
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Création */}
      <form
        onSubmit={onCreate}
        className="flex flex-wrap items-end gap-3 rounded-lg border bg-card p-4"
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="u-name" className="text-sm font-medium">
            Identifiant
          </label>
          <Input
            id="u-name"
            name="username"
            placeholder="gestionnaire1"
            className="w-44"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="u-pass" className="text-sm font-medium">
            Mot de passe (8 caractères min.)
          </label>
          <Input
            id="u-pass"
            name="password"
            type="password"
            className="w-52"
            minLength={8}
            required
          />
        </div>
        <Button
          type="submit"
          disabled={pending}
          className="bg-navy-900 text-white hover:bg-navy-700"
        >
          <UserPlus className="mr-1.5 h-4 w-4" />
          Créer le compte
        </Button>
        {error && <p className="w-full text-sm text-red-600">{error}</p>}
      </form>

      {/* Liste */}
      <div className="flex flex-col gap-3">
        {/* Compte principal (variables d'environnement) */}
        <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 text-white">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-navy-900">{envUser}</p>
            <p className="text-xs text-muted-foreground">
              Compte principal — configuré via les variables d'environnement
              (ADMIN_USERNAME / ADMIN_PASSWORD)
            </p>
          </div>
          <span className="rounded-full bg-stock-in/15 px-3 py-1 text-xs font-medium text-stock-in">
            Principal
          </span>
        </div>

        {rows.map((u) => (
          <div
            key={u.id}
            className="flex items-center gap-4 rounded-lg border bg-card p-4"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 font-bold text-sky-700">
              {u.username.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-navy-900">{u.username}</p>
              <p className="text-xs text-muted-foreground">
                Créé le {new Date(u.createdAt).toLocaleDateString("fr-FR")}
              </p>
            </div>
            <button
              disabled={pending}
              onClick={() => {
                if (confirm(`Supprimer le compte « ${u.username} » ?`))
                  startTransition(async () => {
                    const res = await deleteAdminUser(u.id);
                    if (res.error) setError(res.error);
                  });
              }}
              className="rounded-md p-2 text-muted-foreground hover:bg-red-50 hover:text-red-600"
              aria-label={`Supprimer ${u.username}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
