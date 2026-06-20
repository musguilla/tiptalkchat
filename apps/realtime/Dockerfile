# syntax=docker/dockerfile:1.7
# Build from repo root: `docker build -f apps/realtime/Dockerfile .`

FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm" \
    PATH="$PNPM_HOME:$PATH" \
    NODE_ENV=production
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate
WORKDIR /app

FROM base AS deps
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/realtime/package.json ./apps/realtime/
COPY packages/config/package.json ./packages/config/
COPY packages/db/package.json ./packages/db/
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile

FROM deps AS build
COPY packages ./packages
COPY apps/realtime ./apps/realtime
RUN pnpm --filter @tiptalk/db prisma:generate

FROM base AS runtime
ENV PORT=4001 HOST=0.0.0.0
COPY --from=build /app /app
WORKDIR /app/apps/realtime
EXPOSE 4001
CMD ["pnpm", "tsx", "src/main.ts"]
