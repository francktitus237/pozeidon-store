import { youtubeEmbedUrl, getPromoVideo } from "@/lib/settings";
import { PlayCircle } from "lucide-react";

/** Section vidéo publicitaire de l'accueil — gérée dans /gestion/contenu */
export async function PromoVideoSection() {
  const video = await getPromoVideo();
  if (!video.enabled || !video.url.trim()) return null;

  const yt = youtubeEmbedUrl(video.url);

  return (
    <section className="overflow-hidden rounded-lg border bg-card">
      <div className="flex items-center gap-2 border-b px-5 py-3">
        <PlayCircle className="h-5 w-5 text-cta-500" />
        <h2 className="text-lg font-bold text-navy-900">
          {video.title || "Découvrez nos services"}
        </h2>
      </div>
      {yt ? (
        <iframe
          src={yt}
          title={video.title}
          className="aspect-video w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video
          src={video.url}
          controls
          className="aspect-video w-full bg-black"
        />
      )}
    </section>
  );
}
