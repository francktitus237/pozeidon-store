import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const REVIEWS = [
  {
    name: "Marc T., Douala",
    rating: 5,
    text: "Installation faite en 3 heures, débit excellent. Équipe sérieuse.",
  },
  {
    name: "Aïcha N., Yaoundé",
    rating: 5,
    text: "Commande passée le lundi, matériel livré le mardi.",
  },
  {
    name: "ONG Sahel",
    rating: 4,
    text: "Bon conseil sur le choix du kit pour notre site isolé.",
  },
];

export function Testimonials() {
  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-navy-900">
        Ce que disent nos clients
      </h2>
      <div className="grid gap-3 md:grid-cols-3">
        {REVIEWS.map((r) => (
          <Card key={r.name}>
            <CardContent className="p-4">
              <div className="mb-2 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < r.rating
                        ? "fill-cta-500 text-cta-500"
                        : "text-muted-foreground/40"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm">« {r.text} »</p>
              <p className="mt-2 text-xs font-semibold text-muted-foreground">
                — {r.name}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
