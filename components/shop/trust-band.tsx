import { Truck, BadgeCheck, ShieldCheck, Banknote } from "lucide-react";

const PROMISES = [
  { icon: Truck, text: "Livraison 24-72 h" },
  { icon: BadgeCheck, text: "Matériel authentique garanti" },
  { icon: ShieldCheck, text: "Technicien certifié" },
  { icon: Banknote, text: "Paiement à la livraison possible" },
];

export function TrustBand() {
  return (
    <div className="grid grid-cols-2 gap-3 rounded-lg border bg-sky-50 p-4 md:grid-cols-4">
      {PROMISES.map((p) => (
        <div
          key={p.text}
          className="flex items-center gap-2 text-sm font-medium text-navy-900"
        >
          <p.icon className="h-5 w-5 shrink-0 text-sky-600" />
          {p.text}
        </div>
      ))}
    </div>
  );
}
