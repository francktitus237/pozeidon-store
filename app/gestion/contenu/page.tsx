import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  getRealisations,
  getTestimonials,
  getConseils,
} from "@/lib/settings";
import { ContentManager } from "@/components/admin/content-manager";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const session = await auth();
  if (!session) redirect("/connexion");

  const [realisations, testimonials, conseils] = await Promise.all([
    getRealisations(),
    getTestimonials(),
    getConseils(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-navy-900">Contenu du site</h1>
      <p className="text-sm text-muted-foreground">
        Gérez les blocs affichés sur la page d&apos;accueil : réalisations,
        témoignages clients et conseils.
      </p>

      <ContentManager
        realisations={realisations}
        testimonials={testimonials}
        conseils={conseils}
      />
    </div>
  );
}
