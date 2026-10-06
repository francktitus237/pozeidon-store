import Image from "next/image";
import { getRealisations } from "@/lib/settings";

export async function Realisations() {
  const works = await getRealisations();
  if (works.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-navy-900">
        Nos réalisations
      </h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {works.map((w, i) => (
          <div
            key={`${w.city}-${i}`}
            className="relative flex aspect-[4/3] flex-col items-center justify-center overflow-hidden rounded-lg border bg-sky-50 text-sm"
          >
            {w.image ? (
              <>
                <Image
                  src={w.image}
                  alt={`${w.city} — ${w.label}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-navy-900/80 px-2 py-1.5 text-center text-white">
                  <span className="block font-semibold">{w.city}</span>
                  <span className="block text-xs text-sky-200">{w.label}</span>
                </div>
              </>
            ) : (
              <>
                <span className="font-semibold text-navy-900">{w.city}</span>
                <span className="text-muted-foreground">{w.label}</span>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
