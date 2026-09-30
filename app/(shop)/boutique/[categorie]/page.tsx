interface CategoryPageProps {
  params: Promise<{ categorie: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categorie } = await params;

  // TODO: fil d'Ariane, tri, filtres (prix, disponibilité), grille articles
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold capitalize">
        {categorie.replace(/-/g, " ")}
      </h1>
    </main>
  );
}
