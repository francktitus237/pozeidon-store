interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // TODO: galerie photos/vidéo, prix, case installation, boutons
  // Commander / WhatsApp, onglets, recommandations, barre fixe mobile
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Produit : {slug}</h1>
    </main>
  );
}
