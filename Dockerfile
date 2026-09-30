# ── Build ──────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
# Outils natifs pour compiler better-sqlite3 (pas de prebuild musl)
RUN apk add --no-cache python3 make g++
RUN npm ci

COPY . .
# Base SQLite temporaire pour le prerender au build (le runtime utilisera Postgres via DATABASE_URL)
RUN npx tsx scripts/init-dev-db.ts
RUN npm run build

# ── Runtime ────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Next standalone bundle (voir next.config.ts → output: "standalone")
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
