import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";

// Dev local : fichier SQLite à la racine du projet.
// Prod : basculer sur Postgres (Neon) en remplaçant par drizzle-orm/postgres-js.
const sqlite = new Database(process.env.DATABASE_URL ?? "dev.db");

export const db = drizzle(sqlite, { schema });
