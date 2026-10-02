"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";
import type { CookieBanner as CookieBannerConfig } from "@/lib/settings";

const STORAGE_KEY = "pozeidon_cookie_consent";

export function CookieBanner({ config }: { config: CookieBannerConfig }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!config.enabled) return;
    if (localStorage.getItem(STORAGE_KEY) == null) {
      // petit délai pour laisser la page charger avant l'animation
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, [config.enabled]);

  function answer(choice: "accepted" | "declined") {
    localStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);
  }

  if (!config.enabled || !visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] animate-in slide-in-from-bottom duration-500">
      <div className="container mx-auto px-4 pb-4">
        <div className="flex flex-col gap-3 rounded-xl border bg-background p-4 shadow-lg sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-cta-500" />
            <p className="text-sm text-muted-foreground">
              {config.text}{" "}
              {config.policyLink && (
                <Link
                  href={config.policyLink}
                  className="text-navy-900 underline hover:no-underline"
                >
                  En savoir plus
                </Link>
              )}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:ml-auto">
            <button
              onClick={() => answer("declined")}
              className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
            >
              {config.declineLabel}
            </button>
            <button
              onClick={() => answer("accepted")}
              className="rounded-lg bg-navy-900 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              {config.acceptLabel}
            </button>
            <button
              onClick={() => answer("declined")}
              aria-label="Fermer"
              className="rounded-full p-1.5 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
