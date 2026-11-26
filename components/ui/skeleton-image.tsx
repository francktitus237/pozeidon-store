"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

// Image avec squelette de chargement : un voile animé recouvre la zone
// tant que la photo n'est pas arrivée — les grilles ne "sautent" plus.
// À utiliser dans un conteneur `relative` avec `fill`.
export function SkeletonImage({ className = "", alt, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      <div
        aria-hidden
        className={`absolute inset-0 animate-pulse bg-sky-100 transition-opacity duration-500 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
      />
      <Image
        alt={alt}
        {...props}
        onLoad={(e) => {
          setLoaded(true);
          props.onLoad?.(e);
        }}
        className={`${className} transition-opacity duration-500 ${
          loaded ? "" : "opacity-0"
        }`}
      />
    </>
  );
}
