import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const POSTS = [
  "Combien coûte vraiment Starlink au Cameroun ?",
  "Starlink ou fibre optique : que choisir ?",
  "Bien orienter son antenne : le guide",
];

export function BlogPreview() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-navy-900">Nos conseils</h2>
        <Link
          href="/conseils"
          className="flex items-center gap-1 text-sm font-medium text-sky-600 hover:text-navy-900"
        >
          Tout voir <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {POSTS.map((title) => (
          <Card key={title} className="overflow-hidden">
            <div className="flex aspect-video items-center justify-center bg-sky-50 text-sm text-sky-600">
              image
            </div>
            <CardContent className="p-4">
              <p className="text-sm font-medium leading-snug">{title}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
