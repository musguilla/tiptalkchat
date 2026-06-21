# syntax=docker/dockerfile:1.7
# Multi-stage build for @tiptalk/api. Run from repo root: `docker build -f apps/api/Dockerfile .`

FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm" \
    PATH="$PNPM_HOME:$PATH"
# openssl + ca-certificates required by Prisma's libquery_engine (debian-openssl-3.0.x).
RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate
WORKDIR /app

# --- deps (cacheable). NODE_ENV stays unset so devDeps install (we need
#     `prisma` and `tsx` which are devDependencies of packages/db and apps/api).
FROM base AS deps
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/config/package.json ./packages/config/
COPY packages/db/package.json ./packages/db/
COPY packages/economy/package.json ./packages/economy/
RUN pnpm install --frozen-lockfile

# --- build (generates Prisma client) ---
FROM deps AS build
COPY packages ./packages
COPY apps/api ./apps/api
RUN pnpm --filter @tiptalk/db prisma:generate

# --- runtime ---
FROM base AS runtime
ENV NODE_ENV=production PORT=4000 HOST=0.0.0.0
COPY --from=build /app /app
WORKDIR /app/apps/api
EXPOSE 4000
CMD ["pnpm", "tsx", "src/main.ts"]
