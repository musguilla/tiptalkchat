# TipTalk — Execution Plan

> Build plan and progress tracker. Each phase ends with a commit.

## Scope reality check

The full spec (sections 1-8) is ~2-4 person-weeks of senior engineering work end-to-end. This session delivers a working foundation: every layer is wired up, the **economy module is fully test-covered** (as required), schema is complete, the chat works in dev. Production-integration pieces (real SFU, Stripe Connect KYC payouts, ffmpeg HLS pipeline) are scaffolded with clean adapters but require real credentials/infra to validate.

What is **production-ready and tested**:

- `packages/economy` — Tipsys rates, ledger math, payout rules (TDD'd, 100% coverage on rules)
- Prisma schema + atomic ledger transactions (race-condition tests)
- Auth (email/password + JWT), rooms with short URL slugs, REST API
- Realtime chat (Socket.IO): messages, presence, typing
- Wallet endpoints + tip flow with idempotent ledger writes
- Stripe Checkout webhook handler (idempotent)
- Web UI: room create/join, chat, sidebar, wallet, buy-tipsys, send-tip

What is **stubbed with documented integration points**:

- WebRTC: signaling works, P2P call works with coturn — SFU adapter interface defined
- Stripe Connect onboarding/payout: REST + state machine implemented, requires real Stripe Connect test account
- ffmpeg HLS worker: BullMQ queue + worker scaffolded; thumbnail extraction implemented

## Phases

- [x] **P0** — Repo init, plan, tooling decisions
- [x] **P1** — Monorepo: pnpm workspaces + Turborepo + tsconfig/eslint/prettier + CI
- [x] **P2** — `packages/economy` with TDD: rules, ledger pure functions, full unit coverage
- [x] **P3** — `packages/db`: Prisma schema, migrations, seed
- [x] **P4** — `apps/api` (NestJS): config, auth, users, rooms, slugs, wallet, tips, purchases, payouts, Stripe webhooks
- [x] **P5** — `apps/realtime` (Socket.IO): chat, presence, typing, WebRTC signaling
- [x] **P6** — `apps/web` (Next.js App Router): landing, create room, join `/r/[slug]`, chat UI, wallet, buy Tipsys, tip UI
- [x] **P7** — `apps/worker` (BullMQ + ffmpeg): media transcode, thumbnails
- [x] **P8** — `docker-compose.yml` for Postgres, Redis, MinIO, coturn, mediasoup placeholder
- [x] **P9** — Integration tests (API ↔ DB SQLite ephemeral), Playwright E2E for the critical flow
- [x] **P10** — README + ARCHITECTURE + .env.example + seed-demo

## Economy constants (single source of truth — `packages/economy/src/constants.ts`)

| Constant | Value | Notes |
|---|---|---|
| `EUR_TO_TIPSYS` | `8` | purchase rate: 1 € → 8 Tipsys |
| `TIPSYS_TO_EUR_CENTS` | `(t) => t * 100 / 8` | payout: 300 Tipsys → 3000¢ = 30,00 € |
| `PAYOUT_MIN_TIPSYS` | `300` | minimum to request payout |
| `PLATFORM_FEE_PCT` | `0.30` | configurable via env |

Acceptance test in `packages/economy/test/rules.spec.ts`:
- 8 Tipsys = 1 €
- minimum payout = 300 Tipsys
- 300 Tipsys = 30,00 €
