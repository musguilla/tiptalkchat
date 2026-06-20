# syntax=docker/dockerfile:1.7
# Multi-stage build for @tiptalk/api. Run from repo root: `docker build -f apps/api/Dockerfile .`

FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm" \
    PATH="$PNPM_HOME:$PATH" \
    NODE_ENV=production
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate
WORKDIR /app

# --- deps (cacheable) ---
FROM base AS deps
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/config/package.json ./packages/config/
COPY packages/db/package.json ./packages/db/
COPY packages/economy/package.json ./packages/economy/
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile

# --- build (generates Prisma client) ---
FROM deps AS build
COPY packages ./packages
COPY apps/api ./apps/api
RUN pnpm --filter @tiptalk/db prisma:generate

# --- runtime ---
FROM base AS runtime
ENV PORT=4000 HOST=0.0.0.0
COPY --from=build /app /app
WORKDIR /app/apps/api
EXPOSE 4000
CMD ["pnpm", "tsx", "src/main.ts"]
