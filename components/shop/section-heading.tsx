import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeadingProps {
  title: string;
  href?: string;
}

export function SectionHeading({ title, href }: SectionHeadingProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-xl font-bold text-navy-900">{title}</h2>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-sm font-medium text-sky-600 hover:text-navy-900"
        >
          Voir tout <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
