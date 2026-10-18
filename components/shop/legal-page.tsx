import type { ReactNode } from "react";
import type { Metadata } from "next";

interface Props {
  title: string;
  description: string;
  children: ReactNode;
}

export function legalMetadata({
  title,
  description,
}: {
  title: string;
  description: string;
}): Metadata {
  return { title, description };
}

export function LegalPage({ title, description, children }: Props) {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-navy-900 md:text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
      <article className="space-y-6 leading-relaxed text-muted-foreground">
        {children}
      </article>
    </main>
  );
}
