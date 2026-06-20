# TipTalk — Architecture

## Component overview

```
                         ┌────────────────────────┐
                         │  Browser / mobile WV   │
                         │  Next.js (apps/web)    │
                         └─────┬────────────┬─────┘
                               │ REST (4000)│ WebSocket (4001) + WebRTC
                               ▼            ▼
                  ┌────────────────┐  ┌──────────────────┐
                  │  Fastify API   │  │  Socket.IO + SFU │
                  │  apps/api      │  │  apps/realtime   │
                  └─┬──────────┬───┘  └─────┬────────────┘
                    │          │            │ signaling for WebRTC
                    │          │            ▼
                    │          │      ┌────────────┐
                    │          │      │   coturn   │  (TURN/STUN; LiveKit/
                    │          │      │ STUN+TURN  │   mediasoup in prod)
                    │          │      └────────────┘
                    │          ▼
                    │   ┌──────────────┐
                    │   │ Stripe (test │
                    │   │  + Connect)  │
                    │   └──────────────┘
                    ▼
       ┌─────────────────────┐    ┌──────────────────┐    ┌──────────────────┐
       │ Postgres / SQLite   │    │  Redis           │    │  S3 / MinIO      │
       │ (Prisma)            │    │  (BullMQ queue + │    │  media originals │
       │ - Wallet, Ledger    │    │   presence pubsub│    │  + HLS + thumbs  │
       │ - Room, Message,    │    │   for realtime)  │    │                  │
       │   MediaAsset, Tip,  │    └────────┬─────────┘    └─────┬────────────┘
       │   PayoutRequest,    │             │                    ▲
       │   ConnectAccount    │             ▼                    │
       └─────────────────────┘    ┌──────────────────┐          │
                                  │  Worker          │  ffmpeg  │
                                  │  apps/worker     │──────────┘
                                  │  BullMQ + ffmpeg │
                                  └──────────────────┘
```

## Why these choices

- **pnpm + Turborepo** — fastest install + parallel task graph for the monorepo. Strict TypeScript everywhere.
- **Fastify** instead of NestJS — the spec allows "Express modular"; Fastify is in that family, faster to boot, no decorators/reflection. The route modules in `apps/api/src/routes/` are still cleanly separated.
- **Prisma over SQLite (dev/test) and Postgres (prod)** — single schema file works for both, instant CI runs, no docker needed for tests. The `provider = "sqlite"` line in `schema.prisma` is the only thing that has to change in prod (or override at build time).
- **Socket.IO** — handles the messy parts (reconnection, rooms, broadcasts) and works as the WebRTC signaling channel. Redis adapter is wired so `apps/realtime` can scale horizontally.
- **WebRTC + coturn (P2P)** for ≤4 participants; the call-session schema and signaling are SFU-ready (`sfuMode` enum). For >4 we recommend [mediasoup](https://mediasoup.org/) or [LiveKit](https://livekit.io/) — both fit behind the same `call:*` events.
- **Stripe Checkout + Stripe Connect (Express)** — Checkout for purchases (no PCI scope), Connect Express for payouts (Stripe handles KYC). The webhook handler is idempotent via the event-id audit log.
- **BullMQ** for media — Redis-backed, easy to scale workers horizontally.

## Ledger model (most important)

The wallet balance is **derived** from a strict-append `LedgerEntry` table. `Wallet.balance` is a cache; it must always equal the sum of its ledger. This is enforced by:

1. The pure `deriveBalance()` function in `packages/economy/src/ledger.ts`, which throws if any prefix-sum goes negative.
2. Optimistic locking on `Wallet.version` (every entry bumps it).
3. Idempotency keys on every entry — a retry never double-credits.
4. Paired entries for transfers — `transferTipsys()` writes the sender debit and receiver credit in a single Prisma transaction.

The integration test `apps/api/test/flow.spec.ts §9` asserts: `deriveBalance(ledger) === wallet.balance` after the full purchase→tips→payout cycle.

## Auth

- Email/password with argon2id hashes
- JWT (access only, 15m default); refresh tokens live in `RefreshToken` but the rotation endpoint is a Phase-2 item
- Guest sessions for room joins without an account — they can chat and call but cannot send/receive Tipsys (anti-fraud)
- KYC is required before the first payout (`User.kycStatus` + `ConnectAccount.payoutsEnabled`)

## Slugs

`apps/api/src/lib/slug.ts` generates URLs like `fiesta-tigre-a7k2`. Users can supply a custom slug; sanitized + checked for uniqueness. Endpoint `GET /rooms/slug-available?slug=…` powers real-time availability checks in the UI.

## WebRTC flow

```
   Client A                Realtime                  Client B
   ────────                ────────                  ────────
   call:join roomId ────────► register A
                            broadcast call:peer-joined ─────► (A in peer list)
                                                         ◄──── call:join roomId
                                                              register B
                            ◄──── (offer made via RTCPeerConnection)
   call:signal {to: B, signal: offer}  ────►
                            relay ─────────────────────────► call:signal
                                                              (answer back)
   ◄──── call:signal {to: A, signal: answer}
   ◄──── ICE candidates relayed both ways via call:signal
   ── now P2P via STUN/TURN ──
```

For SFU mode (>4 peers), the same `call:join` request returns an SFU token instead of triggering peer relay — adapter interface lives in `apps/realtime/src/events.ts`.

## Production gaps

Items deliberately left as scaffold-with-clear-interface for a follow-up sprint:

1. **SFU**: peer-to-peer via coturn works for ≤4. For larger calls, swap `apps/realtime`'s `call:join` handler to allocate a LiveKit/mediasoup room and return a token. The shared event contract in `apps/realtime/src/events.ts` does not change.
2. **Stripe Connect KYC**: `POST /connect/onboard` returns a real Stripe Express onboarding URL. The test mode flow works; production requires Stripe Connect platform approval and a verified business.
3. **HLS transcoding at scale**: the worker uses ffmpeg directly. For thousands of users, swap to AWS MediaConvert or a managed service behind the same `MediaAsset.status` state machine.
4. **Refresh-token rotation**: schema + storage are in place; the rotation endpoint and httpOnly-cookie flow are a Phase-2 task.
5. **Content moderation** (CSAM/abuse scanning): `Report` model in place; integration with a service like Hive or AWS Rekognition belongs on the media worker pipeline.
6. **Email verification + OAuth**: stubs in the User model (`emailVerified`) but transport is not wired.

## Mobile (Android/iOS) — future phase

The API and realtime layers are deliberately client-agnostic. To bring native apps online:

- **Reuse**: `packages/economy` (rates/ledger rules), REST contracts in `apps/api`, Socket.IO events in `apps/realtime`. Generate a TypeScript client from the OpenAPI schema (a Phase-2 generator hook).
- **WebRTC**: `react-native-webrtc` (Expo prebuild or bare RN) for both iOS and Android. Same `call:*` signaling events.
- **Payments**: Stripe Mobile SDK for purchases. **Apple App Store policy** classifies in-app virtual currency as IAP — Tipsys purchased inside the iOS app will need to go through StoreKit, with a server-side reconciliation to credit the Tipsys ledger (the Stripe path stays for web purchases). Android: Stripe via web checkout is allowed for "physical or digital goods consumed outside the app" interpretation; Google Play Billing is required for in-app digital content. Plan for both pipelines in `Purchase.kind`.
- **Push notifications**: integrate FCM/APNs at the realtime layer (`presence` and `tip:new` are the highest-value triggers).

## Repo layout

```
.
├── apps/
│   ├── api/         Fastify REST + Stripe webhooks
│   ├── realtime/    Socket.IO + WebRTC signaling
│   ├── web/         Next.js App Router UI
│   └── worker/      BullMQ + ffmpeg HLS transcoder
├── packages/
│   ├── config/      Zod-validated env + shared tsconfig
│   ├── db/          Prisma schema + seed
│   └── economy/     Tipsys rates, ledger, payout (pure functions)
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```
