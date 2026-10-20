// Affiché instantanément pendant le chargement d'une page boutique.
// Le squelette garde la structure visuelle et évite l'écran blanc.
export default function Loading() {
  return (
    <div className="container mx-auto animate-pulse px-4 py-8">
      <div className="mb-6 h-8 w-48 rounded bg-muted" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border p-3">
            <div className="mb-3 aspect-square rounded bg-muted" />
            <div className="mb-2 h-4 w-3/4 rounded bg-muted" />
            <div className="h-4 w-1/3 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
