"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/gestion";

  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setError(null);

    startTransition(async () => {
      const res = await signIn("credentials", {
        username: data.get("username"),
        password: data.get("password"),
        redirect: false,
      });
      if (res?.error) {
        setError("Identifiant ou mot de passe incorrect.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="username" className="text-sm font-medium">
          Identifiant
        </label>
        <Input
          id="username"
          name="username"
          autoComplete="username"
          required
          placeholder="admin"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium">
          Mot de passe
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      <Button
        type="submit"
        disabled={pending}
        className="bg-navy-900 text-white hover:bg-navy-700"
      >
        {pending ? "Connexion…" : "Se connecter"}
      </Button>
    </form>
  );
}
