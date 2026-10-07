"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageField } from "@/components/admin/image-field";
import {
  updateRealisations,
  updateTestimonials,
  updateConseils,
} from "@/features/admin/content-actions";
import type { Realisation, Testimonial, Conseil } from "@/lib/settings";

interface Props {
  realisations: Realisation[];
  testimonials: Testimonial[];
  conseils: Conseil[];
}

function Section({
  title,
  hint,
  children,
  onAdd,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
  onAdd: () => void;
}) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-navy-900">{title}</h2>
        <Button variant="outline" size="sm" onClick={onAdd}>
          <Plus className="mr-1 h-4 w-4" /> Ajouter
        </Button>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">{hint}</p>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

const inputCls =
  "w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500";

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="shrink-0 rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
      aria-label="Supprimer"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}

export function ContentManager({
  realisations: initRea,
  testimonials: initTes,
  conseils: initCon,
}: Props) {
  const [realisations, setRealisations] = useState<Realisation[]>(initRea);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initTes);
  const [conseils, setConseils] = useState<Conseil[]>(initCon);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState("");

  const save = (label: string, fn: () => Promise<void>) => {
    start(async () => {
      await fn();
      setSaved(label);
      setTimeout(() => setSaved(""), 3000);
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <Section
        title="Réalisations"
        hint="Projets/chantiers affichés dans la section « Nos réalisations »."
        onAdd={() =>
          setRealisations((l) => [...l, { city: "", label: "", image: "" }])
        }
      >
        {realisations.map((r, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-md border p-3"
          >
            <div className="flex gap-2">
              <input
                className={inputCls}
                placeholder="Ville (ex : Douala)"
                value={r.city}
                onChange={(e) =>
                  setRealisations((l) =>
                    l.map((x, j) =>
                      j === i ? { ...x, city: e.target.value } : x
                    )
                  )
                }
              />
              <input
                className={inputCls}
                placeholder="Type (ex : villa, hôtel)"
                value={r.label}
                onChange={(e) =>
                  setRealisations((l) =>
                    l.map((x, j) =>
                      j === i ? { ...x, label: e.target.value } : x
                    )
                  )
                }
              />
              <RemoveBtn
                onClick={() =>
                  setRealisations((l) => l.filter((_, j) => j !== i))
                }
              />
            </div>
            <ImageField
              value={r.image ?? ""}
              onChange={(url) =>
                setRealisations((l) =>
                  l.map((x, j) => (j === i ? { ...x, image: url } : x))
                )
              }
            />
          </div>
        ))}
        <Button
          onClick={() => save("Réalisations", () => updateRealisations(realisations))}
          disabled={pending}
          className="self-start bg-cta-500 text-white hover:bg-cta-600"
        >
          {pending && saved === "" ? "Enregistrement…" : "Enregistrer les réalisations"}
        </Button>
      </Section>

      <Section
        title="Témoignages clients"
        hint="Avis affichés dans « Ce que disent nos clients »."
        onAdd={() =>
          setTestimonials((l) => [...l, { name: "", rating: 5, text: "" }])
        }
      >
        {testimonials.map((t, i) => (
          <div key={i} className="flex flex-col gap-2 rounded-md border p-3">
            <div className="flex gap-2">
              <input
                className={inputCls}
                placeholder="Nom (ex : Marc T., Douala)"
                value={t.name}
                onChange={(e) =>
                  setTestimonials((l) =>
                    l.map((x, j) =>
                      j === i ? { ...x, name: e.target.value } : x
                    )
                  )
                }
              />
              <div className="flex shrink-0 items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() =>
                      setTestimonials((l) =>
                        l.map((x, j) => (j === i ? { ...x, rating: n } : x))
                      )
                    }
                    aria-label={`${n} étoile(s)`}
                  >
                    <Star
                      className={`h-4 w-4 ${
                        n <= t.rating
                          ? "fill-cta-500 text-cta-500"
                          : "text-muted-foreground/40"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <RemoveBtn
                onClick={() =>
                  setTestimonials((l) => l.filter((_, j) => j !== i))
                }
              />
            </div>
            <textarea
              className={inputCls}
              rows={2}
              placeholder="Texte du témoignage"
              value={t.text}
              onChange={(e) =>
                setTestimonials((l) =>
                  l.map((x, j) => (j === i ? { ...x, text: e.target.value } : x))
                )
              }
            />
          </div>
        ))}
        <Button
          onClick={() => save("Témoignages", () => updateTestimonials(testimonials))}
          disabled={pending}
          className="self-start bg-cta-500 text-white hover:bg-cta-600"
        >
          Enregistrer les témoignages
        </Button>
      </Section>

      <Section
        title="Conseils"
        hint="Articles affichés dans la section « Nos conseils » de l'accueil."
        onAdd={() => setConseils((l) => [...l, { title: "", image: "" }])}
      >
        {conseils.map((c, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-md border p-3"
          >
            <div className="flex gap-2">
              <input
                className={inputCls}
                placeholder="Titre de l'article"
                value={c.title}
                onChange={(e) =>
                  setConseils((l) =>
                    l.map((x, j) =>
                      j === i ? { ...x, title: e.target.value } : x
                    )
                  )
                }
              />
              <RemoveBtn
                onClick={() => setConseils((l) => l.filter((_, j) => j !== i))}
              />
            </div>
            <ImageField
              value={c.image ?? ""}
              onChange={(url) =>
                setConseils((l) =>
                  l.map((x, j) => (j === i ? { ...x, image: url } : x))
                )
              }
            />
          </div>
        ))}
        <Button
          onClick={() => save("Conseils", () => updateConseils(conseils))}
          disabled={pending}
          className="self-start bg-cta-500 text-white hover:bg-cta-600"
        >
          Enregistrer les conseils
        </Button>
      </Section>

      {saved && (
        <p className="text-sm font-medium text-stock-in">
          {saved} enregistré(s) ✓
        </p>
      )}
    </div>
  );
}
