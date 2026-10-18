"use client";

import { useState } from "react";
import Image from "next/image";
import { Expand } from "lucide-react";
import { ImageLightbox } from "./image-lightbox";

interface Props {
  images: string[];
  alt: string;
}

export function ProductGallery({ images, alt }: Props) {
  const [selected, setSelected] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const main = images[selected] ?? images[0];

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="relative aspect-square w-full overflow-hidden rounded-xl bg-sky-50 text-left"
        aria-label="Agrandir l'image"
      >
        {main ? (
          <Image
            src={main}
            alt={alt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sky-600">
            Photo article
          </div>
        )}
        {main && (
          <span className="absolute bottom-3 right-3 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm">
            <Expand className="h-4 w-4" />
          </span>
        )}
      </button>

      <ImageLightbox
        images={images}
        alt={alt}
        open={lightboxOpen}
        index={selected}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={setSelected}
      />

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setSelected(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-sky-50 ${
                i === selected
                  ? "ring-2 ring-cta-500 ring-offset-1"
                  : "hover:opacity-80"
              }`}
              aria-label={`Image ${i + 1}`}
            >
              <Image
                src={src}
                alt={`${alt} - ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
