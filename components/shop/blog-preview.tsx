import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getConseils } from "@/lib/settings";

export async function BlogPreview() {
  const posts = await getConseils();
  if (posts.length === 0) return null;

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
        {posts.map((post) => (
          <Card key={post.title} className="overflow-hidden">
            <div className="relative flex aspect-video items-center justify-center bg-sky-50 text-sm text-sky-600">
              {post.image ? (
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              ) : (
                "image"
              )}
            </div>
            <CardContent className="p-4">
              <p className="text-sm font-medium leading-snug">{post.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
