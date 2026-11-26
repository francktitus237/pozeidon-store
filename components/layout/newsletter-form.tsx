"use client";

import { useState, useTransition } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { subscribeNewsletter } from "@/features/newsletter/actions";

export function NewsletterForm() {
  const [pending, startTransition] = useTransition();
  const [welcome, setWelcome] = useState<{
    code: string;
    percent: number;
  } | null>(null);
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "");
    startTransition(async () => {
      const res = await subscribeNewsletter(email);
      if (res.error) {
        toast.add({ title: "Erreur", description: res.error, type: "error" });
      } else {
        setWelcome(res.welcome ?? null);
        setDone(true);
      }
    });
  }

  if (done) {
    return (
      <div className="max-w-sm text-sm text-sky-100">
        <p>Merci ! Vous recevrez nos nouveautés et promotions par email.</p>
        {welcome && (
          <p className="mt-2">
            Cadeau de bienvenue :{" "}
            <span className="rounded bg-cta-500 px-2 py-0.5 font-mono font-bold text-white">
              {welcome.code}
            </span>{" "}
            — {welcome.percent}% de remise sur votre commande.
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex max-w-sm gap-2">
      <div className="relative flex-1">
        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-400" />
        <Input
          name="email"
          type="email"
          required
          placeholder="Votre adresse email"
          className="border-navy-700 bg-navy-800 pl-9 text-white placeholder:text-sky-100/50"
        />
      </div>
      <Button
        type="submit"
        disabled={pending}
        className="bg-cta-500 text-white hover:bg-cta-600"
      >
        {pending ? "…" : "S'inscrire"}
      </Button>
    </form>
  );
}
