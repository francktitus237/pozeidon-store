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

const pgDb = isPostgres
  ? drizzlePg(postgres(url, { prepare: false }), { schema: pgSchema })
  : null;
const sqliteDb = !isPostgres ? drizzleSqlite(new Database(url), { schema: sqliteSchema }) : null;

// Les deux schémas exposent les mêmes formes de données ; on force le type pg.
export const db = (pgDb ??
  (sqliteDb as unknown as PostgresJsDatabase<typeof pgSchema>)) as PostgresJsDatabase<
  typeof pgSchema
>;
