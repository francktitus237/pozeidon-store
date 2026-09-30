import { defineConfig } from "drizzle-kit";

// Config pour la base SQLite locale (dev.db)
// Usage : npx drizzle-kit push --config=drizzle.sqlite.config.ts
export default defineConfig({
  dialect: "sqlite",
  schema: "./lib/db/schema.sqlite.ts",
  out: "./drizzle-sqlite",
  dbCredentials: {
    url: "dev.db",
  },
});
