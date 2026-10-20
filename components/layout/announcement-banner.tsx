"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface Announcement {
  text: string;
  link?: string;
  enabled: boolean;
  bg?: "navy" | "sky" | "cta";
}

interface Props {
  announcement: Announcement;
  bgClass: string;
}

export function AnnouncementBanner({ announcement, bgClass }: Props) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const key = `announcement-dismissed-${announcement.text}`;
    if (sessionStorage.getItem(key) === "1") setDismissed(true);
  }, [announcement.text]);

  if (!announcement.enabled || dismissed) return null;

  const text = announcement.link ? (
    <Link
      href={announcement.link}
      className="hover:underline"
    >
      {announcement.text}
    </Link>
  ) : (
    <span>{announcement.text}</span>
  );

  // Le texte est répété plusieurs fois pour que la piste du marquee
  // soit toujours plus large que l'écran (sinon le défilement -50%
  // n'a rien à faire défiler et la bannière paraît figée).
  const copies = Array.from({ length: 4 }, (_, i) => i);

  return (
    <div
      className={`relative overflow-hidden py-2 text-xs text-white ${bgClass}`}
    >
      <div className="animate-marquee flex w-max whitespace-nowrap">
        {[0, 1].map((half) => (
          <span
            key={half}
            aria-hidden={half === 1}
            className="flex shrink-0 gap-12 pr-12"
          >
            {copies.map((i) => (
              <span key={i}>{text}</span>
            ))}
          </span>
        ))}
      </div>
      <button
        type="button"
        onClick={() => {
          sessionStorage.setItem(
            `announcement-dismissed-${announcement.text}`,
            "1"
          );
          setDismissed(true);
        }}
        className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded bg-black/20 p-1 hover:bg-white/20"
        aria-label="Fermer"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
