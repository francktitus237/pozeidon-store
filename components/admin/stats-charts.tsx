"use client";

// Graphiques du tableau de bord / gestion/statistiques.
// Reçoit des données déjà agrégées côté serveur — pas de calcul ici.

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export interface RevenuePoint {
  month: string; // "janv. 2026"
  total: number; // FCFA
  orders: number;
}

export interface StatusSlice {
  label: string;
  count: number;
}

export interface TopProduct {
  name: string;
  quantity: number;
  revenue: number;
}

const STATUS_COLORS: Record<string, string> = {
  "En attente": "#f59e0b",
  "Confirmées": "#0ea5e9",
  "Préparation": "#6366f1",
  "Livrées": "#16a34a",
  "Annulées": "#dc2626",
};

const compact = new Intl.NumberFormat("fr-FR", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const full = new Intl.NumberFormat("fr-FR");

function FcfaTick({ x = 0, y = 0, payload }: any) {
  return (
    <text x={x} y={y} dy={12} textAnchor="middle" fontSize={11} fill="#64748b">
      {compact.format(payload.value)}
    </text>
  );
}

const tooltipFmt = (v: any) =>
  `${full.format(Number(v))} FCFA`;

export function RevenueChart({ data }: { data: RevenuePoint[] }) {
  if (!data.length)
    return <p className="text-sm text-muted-foreground">Pas encore de données.</p>;
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="month" fontSize={11} tickLine={false} />
        <YAxis tick={<FcfaTick />} tickLine={false} axisLine={false} width={52} />
        <Tooltip formatter={tooltipFmt} />
        <Area
          type="monotone"
          dataKey="total"
          name="Chiffre d'affaires"
          stroke="#0ea5e9"
          strokeWidth={2}
          fill="url(#revGrad)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function StatusPie({ data }: { data: StatusSlice[] }) {
  const slices = data.filter((s) => s.count > 0);
  if (!slices.length)
    return <p className="text-sm text-muted-foreground">Aucune commande.</p>;
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={slices}
          dataKey="count"
          nameKey="label"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={3}
        >
          {slices.map((s) => (
            <Cell key={s.label} fill={STATUS_COLORS[s.label] ?? "#94a3b8"} />
          ))}
        </Pie>
        <Tooltip formatter={(v) => `${v} commande(s)`} />
        <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function TopProductsBar({ data }: { data: TopProduct[] }) {
  if (!data.length)
    return (
      <p className="text-sm text-muted-foreground">
        Les produits vendus apparaîtront ici.
      </p>
    );
  return (
    <ResponsiveContainer width="100%" height={Math.max(180, data.length * 44)}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 16, bottom: 4, left: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          width={170}
          fontSize={11}
          tickLine={false}
          tickFormatter={(n: string) => (n.length > 26 ? n.slice(0, 25) + "…" : n)}
        />
        <Tooltip
          formatter={(v, name) =>
            name === "quantity" ? [`${v} vendu(s)`, "Quantité"] : [tooltipFmt(v as number), "CA"]
          }
        />
        <Bar dataKey="quantity" fill="#0f172a" radius={[0, 4, 4, 0]} barSize={18} />
      </BarChart>
    </ResponsiveContainer>
  );
}
