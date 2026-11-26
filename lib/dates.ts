// Normalise les timestamps lus en base : Postgres renvoie des Date,
// SQLite (dev) renvoie l'epoch en secondes via le schéma pg.
export function toDate(v: unknown): Date {
  if (v instanceof Date) return v;
  if (typeof v === "number") return new Date(v < 1e12 ? v * 1000 : v);
  return new Date(String(v));
}

export function toIso(v: unknown): string {
  return toDate(v).toISOString();
}
