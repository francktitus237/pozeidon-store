import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  href?: string;
  color?: "sky" | "orange" | "emerald" | "violet";
}

const RING: Record<string, string> = {
  sky: "bg-sky-100 text-sky-600",
  orange: "bg-cta-100 text-cta-600",
  emerald: "bg-emerald-100 text-emerald-600",
  violet: "bg-violet-100 text-violet-600",
};

export function KpiCard({ label, value, hint, icon: Icon, href, color = "sky" }: Props) {
  const body = (
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-bold text-navy-900">{value}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
      </div>
      <span className={`flex h-10 w-10 items-center justify-center rounded-full ${RING[color]}`}>
        <Icon className="h-5 w-5" />
      </span>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block rounded-lg border bg-card p-4 transition-shadow hover:shadow-md"
      >
        {body}
      </Link>
    );
  }

  return <div className="rounded-lg border bg-card p-4">{body}</div>;
}
