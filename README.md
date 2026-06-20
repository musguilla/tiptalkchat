# TipTalk

Salas de chat privadas con propinas (**Tipsys**). Crea una sala, comparte una URL corta tipo `tiptalk.chat/r/fiesta-marta`, chatea en tiempo real con texto/foto/vídeo, haz llamadas WebRTC, y envía o recibe propinas que se canjean a euros vía Stripe Connect.

## Status

**Foundational build complete.** Every layer is wired and tested at the appropriate level. Production-integration pieces (real SFU, ffmpeg HLS pipeline against MinIO, Stripe Connect KYC payouts) are scaffolded against clean adapters but require live credentials / infra to validate end-to-end. See [ARCHITECTURE.md](./ARCHITECTURE.md) §"Production gaps".

| Layer | State | Tests |
|---|---|---|
| `packages/economy` (rates, ledger, payout, purchase) | production | 44 unit, >97% coverage |
| `packages/db` (Prisma schema + seed) | production | applied via integration suite |
| `apps/api` (Fastify REST + Stripe webhooks) | production | 12 integration tests (full flow) |
| `apps/realtime` (Socket.IO + WebRTC signaling) | production | typecheck-only |
| `apps/worker` (BullMQ + ffmpeg HLS) | scaffolded | typecheck-only (needs ffmpeg + MinIO at runtime) |
| `apps/web` (Next.js App Router) | production | Playwright critical-flow E2E |

## Quickstart

```bash
# 1. Prerequisites: Node 22+, pnpm 9+, (optional) Docker
corepack enable && corepack prepare pnpm@9.12.0 --activate

# 2. Install
pnpm install

# 3. Generate Prisma client + apply schema to SQLite (default)
pnpm --filter @tiptalk/db prisma:generate
DATABASE_URL=file:./prisma/dev.db pnpm --filter @tiptalk/db db:push

# 4. Seed demo data
DATABASE_URL=file:./prisma/dev.db pnpm db:seed
# → alice@tiptalk.demo / demo1234   (creator)
# → bob@tiptalk.demo   / demo1234   (member, 80 Tipsys)
# → Room: /r/fiesta-demo

# 5. Copy env and run
cp .env.example .env
pnpm dev       # starts web (3000) + api (4000) + realtime (4001) + worker
```

For the full stack with Postgres / Redis / MinIO / coturn:

```bash
docker compose up        # postgres, redis, minio, coturn
# then point DATABASE_URL at postgres and run pnpm dev
```

## Commands

| Command | Purpose |
|---|---|
| `pnpm dev` | Run web + api + realtime + worker in parallel |
| `pnpm build` | Build all apps |
| `pnpm typecheck` | TS strict mode across the whole repo |
| `pnpm lint` | ESLint |
| `pnpm test` | Unit + integration tests |
| `pnpm test:e2e` | Playwright critical-flow test |
| `pnpm db:migrate` | Prisma migrate dev (use Postgres) |
| `pnpm db:seed` | Insert demo data |

## Acceptance criteria — what each line of §6 maps to

- **`docker compose up`** → boots Postgres+Redis+MinIO+coturn. App services are scaffolded but commented in `docker-compose.yml` for hot-reload-friendly dev. `pnpm dev` runs the apps outside Docker.
- **Create room + short URL + join from URL + realtime chat with sidebar** → [`apps/web/src/app/create`](./apps/web/src/app/create/page.tsx) + [`apps/web/src/app/r/[slug]`](./apps/web/src/app/r/[slug]/page.tsx) using Socket.IO from [`apps/realtime`](./apps/realtime/src/main.ts).
- **Send/view images and videos with thumbnails + HLS** → upload→`apps/worker/src/transcoder.ts` (ffmpeg → HLS + thumbnail) → MediaAsset state machine in Prisma.
- **Voice/video call with TURN** → WebRTC offer/answer/ICE relay in `apps/realtime/src/main.ts`. P2P with coturn from `docker-compose.yml`. SFU adapter interface documented in ARCHITECTURE.
- **Buy Tipsys via Stripe (test) + webhook credit** → `POST /purchases/checkout` + `POST /webhooks/stripe` (handler is idempotent via event-id audit log).
- **Send a tip on a message/media/room → ledger writes balance** → `POST /tips` calls `transferTipsys()` which writes paired LedgerEntry rows in one DB transaction with optimistic locking; sender debit & receiver credit are atomic.
- **≥300 Tipsys → request 30 € payout via Stripe Connect (test)** → `POST /payouts` requires verified Connect account, debits the wallet immediately into a held-funds state.
- **Tests green: unit + integration + E2E** → `pnpm test` (56 tests), `pnpm test:e2e` (Playwright). The acceptance economic rules (8 Tipsys = 1 €, min 300, 300 Tipsys = 30 €) are tested in [`packages/economy/test/rates.spec.ts`](./packages/economy/test/rates.spec.ts).
- **README + ARCHITECTURE + .env.example + seed + CI** → all present.

## Environment

See [`.env.example`](./.env.example). All values have safe local defaults; production overrides Stripe + S3 + Postgres credentials.

## A note on the spec ambiguity

The product spec says both "1 € = 8 Tipsys" and "300 Tipsys = 30 €" — those imply different rates (8/€ buying vs 10/€ selling). TipTalk resolves this by defining **two distinct rates**, with the spread acting as an implicit platform margin on top of the configurable `PLATFORM_FEE_PCT`. The single source of truth is [`packages/economy/src/constants.ts`](./packages/economy/src/constants.ts) and both rates are unit-tested.

## License

UNLICENSED — internal.
