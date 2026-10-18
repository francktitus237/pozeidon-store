import Link from "next/link";
import Image from "next/image";
import { Home, ShoppingBag, MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { SITE_NAME } from "@/lib/constants";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-sky-50 px-4 text-center">
      <Image
        src="/logo-mark.png"
        alt={`Logo ${SITE_NAME}`}
        width={96}
        height={96}
        className="h-24 w-24 object-contain"
      />
      <div>
        <p className="text-6xl font-bold text-navy-900">404</p>
        <h1 className="mt-2 text-xl font-semibold">Page introuvable</h1>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          La page que vous cherchez n&apos;existe pas ou a été déplacée. Pas de
          panique, on vous ramène à la boutique.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "default" }),
            "bg-navy-900 text-white hover:bg-navy-700"
          )}
        >
          <Home className="mr-2 h-4 w-4" />
          Accueil
        </Link>
        <Link
          href="/boutique"
          className={cn(buttonVariants({ variant: "outline" }), "border-navy-900/20")}
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          Boutique
        </Link>
        <Link
          href="/contact"
          className={cn(buttonVariants({ variant: "outline" }), "border-navy-900/20")}
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Contact
        </Link>
      </div>
    </main>
  );
}
