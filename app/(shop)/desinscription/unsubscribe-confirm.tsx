"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Check, Loader2 } from "lucide-react";
import { unsubscribeByEmail } from "@/features/newsletter/actions";

export function UnsubscribeConfirm({ email }: { email: string }) {
  const [done, setDone] = useState<boolean | null>(null);
  const [pending, startTransition] = useTransition();

  function confirm() {
    startTransition(async () => {
      const res = await unsubscribeByEmail(email);
      setDone(res.ok);
    });
  }

  if (done === true) {
    return (
      <>
        <p className="flex items-center gap-2 text-sm font-medium text-stock-in">
          <Check className="h-4 w-4" />
          Vous êtes désinscrit — vous ne recevrez plus nos emails.
        </p>
        <Link
          href="/"
          className="mt-2 rounded-full bg-navy-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-navy-700"
        >
          Retour à la boutique
        </Link>
      </>
    );
  }

  return (
    <>
      <p className="text-sm text-muted-foreground">
        Confirmez pour retirer <strong>{email}</strong> de la liste des abonnés.
      </p>
      {done === false && (
        <p className="text-sm text-destructive">
          Une erreur est survenue, réessayez.
        </p>
      )}
      <button
        type="button"
        onClick={confirm}
        disabled={pending}
        className="mt-2 inline-flex items-center gap-2 rounded-full bg-navy-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-navy-700 disabled:opacity-50"
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        Confirmer la désinscription
      </button>
    </>
  );
}
