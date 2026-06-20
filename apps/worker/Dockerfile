# syntax=docker/dockerfile:1.7
# Worker requires ffmpeg in the image. Only used when VIDEO_PROVIDER=local.
# In production with Mux this service is OPTIONAL.

FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm" \
    PATH="$PNPM_HOME:$PATH" \
    NODE_ENV=production
RUN apt-get update \
 && apt-get install -y --no-install-recommends ffmpeg ca-certificates \
 && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate
WORKDIR /app

FROM base AS deps
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/worker/package.json ./apps/worker/
COPY packages/config/package.json ./packages/config/
COPY packages/db/package.json ./packages/db/
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile

FROM deps AS build
COPY packages ./packages
COPY apps/worker ./apps/worker
RUN pnpm --filter @tiptalk/db prisma:generate

FROM base AS runtime
COPY --from=build /app /app
WORKDIR /app/apps/worker
CMD ["pnpm", "tsx", "src/main.ts"]
