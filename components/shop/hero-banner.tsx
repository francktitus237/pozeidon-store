"use client";

import Link from "next/link";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

const SLIDES = [
  {
    title: "Ordinateurs neufs & occasion",
    subtitle: "Unités centrales, desktop complets — contrôle qualité garanti",
    cta: "Voir les ordinateurs",
    href: "/boutique/ordinateurs",
    image: "/images/kit-starlink.jpg",
  },
  {
    title: "Maintenance & installation",
    subtitle: "Logiciels, systèmes et caméras de surveillance — devis gratuit",
    cta: "Demander un devis",
    href: "/services",
    image: "/images/antenne-starlink.jpg",
  },
  {
    title: "Accessoires Starlink",
    subtitle: "Chargeurs, câbles, supports et routeurs V4 & Mini",
    cta: "Voir les accessoires",
    href: "/boutique/accessoires-starlink",
    image: "/images/cable.jpg",
  },
  {
    title: "Accessoires informatiques",
    subtitle: "Répéteurs WiFi, écrans, batteries, claviers, chargeurs",
    cta: "Voir le catalogue",
    href: "/boutique/accessoires-informatique",
    image: "/images/connecteur.jpg",
  },
];

export function HeroBanner() {
  return (
    <Carousel
      opts={{ loop: true }}
      plugins={[Autoplay({ delay: 5000 })]}
      className="w-full"
    >
      <CarouselContent>
        {SLIDES.map((s, i) => (
          <CarouselItem key={i}>
            <div className="relative flex min-h-56 flex-col items-start justify-center gap-3 overflow-hidden rounded-lg px-6 py-10 text-white md:min-h-72 md:px-12">
              <Image
                src={s.image}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 75vw"
                className="object-cover"
                priority={i === 0}
              />
              <div className="absolute inset-0 bg-navy-900/70" />
              <h2 className="relative z-10 max-w-lg text-2xl font-bold md:text-3xl">
                {s.title}
              </h2>
              <p className="relative z-10 text-sm text-sky-100 md:text-base">
                {s.subtitle}
              </p>
              <Button
                render={<Link href={s.href} />}
                nativeButton={false}
                className="relative z-10 mt-2 bg-cta-500 text-white hover:bg-cta-600"
              >
                {s.cta}
              </Button>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-3" />
      <CarouselNext className="right-3" />
    </Carousel>
  );
}
