import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";
import postgres from "postgres";
import Database from "better-sqlite3";
import * as pgSchema from "./schema";
import * as sqliteSchema from "./schema.sqlite";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

// Dual-driver :
// - DATABASE_URL commence par "postgres" → Postgres (Dokploy, Neon…)
// - sinon → fichier SQLite local (dev.db) pour le dev hors-ligne
const url = process.env.DATABASE_URL ?? "dev.db";
const isPostgres = url.startsWith("postgres");

const pgClient = isPostgres
  ? postgres(url, {
      prepare: false,
      onnotice: () => {},
      idle_timeout: 60 * 5,
      max_lifetime: 60 * 30,
      connect_timeout: 30,
    })
  : null;
if (pgClient) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof (pgClient as any).on === "function") {
    (pgClient as any).on("error", (err: Error) => {
      console.error("[db] postgres connection error", err.message);
    });
  }
}

const pgDb = pgClient ? drizzlePg(pgClient, { schema: pgSchema }) : null;
const sqliteDb = !isPostgres ? drizzleSqlite(new Database(url), { schema: sqliteSchema }) : null;

// Les deux schémas exposent les mêmes formes de données ; on force le type pg.
export const db = (pgDb ??
  (sqliteDb as unknown as PostgresJsDatabase<typeof pgSchema>)) as PostgresJsDatabase<
  typeof pgSchema
>;

// Filet de sécurité : certaines erreurs réseau (ECONNRESET) proviennent d'une
// connexion fermée par un proxy ou PostgreSQL en idle. On les logue sans tuer
// le processus, pour que le site reste stable.
process.on("uncaughtException", (err) => {
  const code = (err as { code?: string }).code;
  if (code === "ECONNRESET" || code === "ECONNABORTED") {
    console.error("[process] caught", code, "- continuing");
    return;
  }
  console.error("[process] uncaughtException", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  const code = (reason as { code?: string })?.code;
  if (code === "ECONNRESET" || code === "ECONNABORTED") {
    console.error("[process] caught unhandled", code, "- continuing");
    return;
  }
  console.error("[process] unhandledRejection", reason);
});
