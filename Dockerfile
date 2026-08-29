# syntax=docker/dockerfile:1

FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# npm ci requires the lockfile to already enumerate every platform-specific
# optional dependency (e.g. sharp's linux-musl/wasm fallback packages), which
# a lockfile generated on a different host OS (Windows, macOS) won't have.
# npm install resolves those correctly for the actual build platform.
RUN npm install

FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# `prisma generate` only needs DATABASE_URL to be *present* (prisma.config.ts
# reads it via env()), not reachable — it never connects to the database.
# All app pages render with `dynamic = "force-dynamic"` (see PLAN.md), so
# `next build` itself never touches Postgres either.
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
RUN npx prisma generate
RUN npm run build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Full node_modules first (needed for `prisma migrate deploy`/`db seed` at
# container start), then the trimmed Next.js standalone server on top.
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/package.json ./package.json

COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh \
  && mkdir -p ./public/uploads \
  && chown -R nextjs:nodejs ./public/uploads

USER nextjs
EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
