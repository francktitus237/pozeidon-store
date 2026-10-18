// Exécuté une seule fois au démarrage du serveur Next.js.
// Ce fichier est aussi compilé pour l'Edge runtime : tout le code Node
// (fs, path, process.cwd, postgres) vit dans lib/init-db.ts et n'est
// chargé dynamiquement qu'en runtime Node — évite les warnings Edge.

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { initPostgres } = await import("./lib/init-db");
    await initPostgres();
  }
}
