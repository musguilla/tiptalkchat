# TipTalk — Deployment Guide

Stack:

| Layer | Provider | Notes |
|---|---|---|
| Web (`apps/web`) | **Vercel** | Next.js, free tier OK |
| API (`apps/api`) | **Railway** | Fastify Dockerfile, ~$5/mo |
| Realtime (`apps/realtime`) | **Railway** | Socket.IO Dockerfile, ~$5/mo |
| Worker (`apps/worker`) | **Railway** (optional) | Only needed if `VIDEO_PROVIDER=local`; with Mux you can skip it |
| Postgres | **Supabase** | Free tier 500MB |
| Redis | **Upstash** | Free tier 10k cmds/day, serverless |
| Image storage | **Supabase Storage** | Already on Supabase; switch to R2 later if egress hurts |
| Video | **Mux** | Direct Upload → HLS + thumb + CDN. ~$0.005/min |
| WebRTC SFU + TURN | **LiveKit Cloud** | Free tier 50 participant-min/mo |
| Payments | **Stripe** | Test mode → live |

This file walks you through provisioning each piece and wiring the env vars.

---

## 0. Prerequisites

- Push your repo to GitHub (already done if you see this in the repo).
- Have a credit card on hand for the trial/free tiers — none charge without you upgrading.

---

## 1. Supabase (Postgres + image storage)

1. Create a project at https://supabase.com.
2. **Postgres connection string** → Settings → Database → "Connection string" → URI mode.
   Copy the **pooled** connection (port 6543, `pgbouncer=true`). This is what apps will use.
   Also copy the **direct** connection (port 5432) — Prisma migrations need this.
3. **Storage bucket** → Storage → Create new bucket named `tiptalk-media` → make it **public**.
4. **Service role key** → Settings → API → copy `service_role` (NOT the `anon` key).
5. Generate the first Postgres migration **locally** against your Supabase DB:

   ```bash
   # Use the DIRECT connection (not pooled) for migrate dev
   export DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
   pnpm --filter @tiptalk/db prisma migrate dev --name init
   pnpm --filter @tiptalk/db seed
   ```

Env you collected:

- `DATABASE_URL` (pooled) — `postgresql://postgres:...@aws-...pooler.supabase.com:6543/postgres?pgbouncer=true`
- `DIRECT_DATABASE_URL` (direct) — `postgresql://postgres:...@db.[project].supabase.co:5432/postgres`
- `SUPABASE_URL` — `https://[project].supabase.co`
- `SUPABASE_SERVICE_KEY` — the `service_role` key
- `SUPABASE_BUCKET` — `tiptalk-media`

---

## 2. Upstash (Redis)

1. Create a Redis database at https://upstash.com → Free tier, region close to Railway.
2. Copy the **TLS connection string** (`rediss://...`).

Env:

- `REDIS_URL` — `rediss://default:...@...upstash.io:6379`

---

## 3. Mux (video upload + HLS)

1. Sign up at https://mux.com → create a new environment.
2. Settings → API Access Tokens → create new token with **Video** access (read + write).
3. Settings → Webhooks → create a webhook with URL `https://<your-api-on-railway>/webhooks/mux/`. Copy the signing secret.

Env:

- `VIDEO_PROVIDER=mux`
- `MUX_TOKEN_ID`
- `MUX_TOKEN_SECRET`
- `MUX_WEBHOOK_SECRET`

---

## 4. LiveKit Cloud (WebRTC SFU + TURN)

1. Sign up at https://livekit.io → Cloud.
2. Create a project. Copy:

Env:

- `SFU_PROVIDER=livekit`
- `LIVEKIT_URL` — `wss://[project].livekit.cloud`
- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`

---

## 5. Stripe

1. https://dashboard.stripe.com → use the toggle to start in **Test mode**.
2. API keys → copy the secret key (`sk_test_...`).
3. Webhooks → add endpoint `https://<your-api-on-railway>/webhooks/stripe/` listening to:
   - `checkout.session.completed`
   - `account.updated`
   - `transfer.created`
   - `payout.failed`
   Copy the signing secret.
4. Connect → enable Express accounts.

Env:

- `STRIPE_SECRET_KEY` — `sk_test_...`
- `STRIPE_WEBHOOK_SECRET` — `whsec_...`
- `STRIPE_CONNECT_CLIENT_ID` — from Connect settings

---

## 6. Railway (api + realtime + worker)

1. https://railway.app → "New project" → "Deploy from GitHub repo" → pick `tiptalkchat`.
2. Railway will detect the monorepo. Create **three services**:

   **Service 1: api**
   - Settings → Source → Root Directory: `apps/api`
   - Variables: paste the env block below for `api`
   - Networking → generate a public domain → copy it (this is your `API_URL`)

   **Service 2: realtime**
   - Settings → Source → Root Directory: `apps/realtime`
   - Variables: paste the env block below for `realtime`
   - Networking → public domain → copy it (this is your `REALTIME_URL`)

   **Service 3: worker** (optional — skip if `VIDEO_PROVIDER=mux`)
   - Settings → Source → Root Directory: `apps/worker`
   - Variables: paste the env block below for `worker`

3. Once `api` is up, hit `https://<api>/healthz` — must respond `{"ok":true,...}`.

### Env block for `api`

```
NODE_ENV=production
PORT=4000
WEB_URL=https://<your-vercel-url>
API_URL=https://<this-service-public-domain>
REALTIME_URL=https://<realtime-service-public-domain>
PUBLIC_BASE_URL=https://<your-vercel-url>

DATABASE_URL=<Supabase pooled URL>
REDIS_URL=<Upstash URL>

JWT_ACCESS_SECRET=<openssl rand -hex 32>
JWT_REFRESH_SECRET=<openssl rand -hex 32>

STORAGE_PROVIDER=supabase
SUPABASE_URL=https://[project].supabase.co
SUPABASE_SERVICE_KEY=<service_role>
SUPABASE_BUCKET=tiptalk-media

VIDEO_PROVIDER=mux
MUX_TOKEN_ID=...
MUX_TOKEN_SECRET=...
MUX_WEBHOOK_SECRET=...

SFU_PROVIDER=livekit
LIVEKIT_URL=wss://[project].livekit.cloud
LIVEKIT_API_KEY=...
LIVEKIT_API_SECRET=...

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CONNECT_CLIENT_ID=ca_...

PLATFORM_FEE_PCT=0.30
```

### Env block for `realtime`

```
NODE_ENV=production
PORT=4001
WEB_URL=https://<your-vercel-url>

DATABASE_URL=<Supabase pooled URL>
REDIS_URL=<Upstash URL>
JWT_ACCESS_SECRET=<same as api>

# Realtime only needs SFU config when you want to broker LiveKit tokens here;
# in this stack the api issues tokens, so realtime can be lean.
```

### Env block for `worker` (skip if using Mux)

```
NODE_ENV=production
DATABASE_URL=<Supabase pooled URL>
REDIS_URL=<Upstash URL>
STORAGE_PROVIDER=supabase
SUPABASE_URL=https://[project].supabase.co
SUPABASE_SERVICE_KEY=<service_role>
SUPABASE_BUCKET=tiptalk-media
```

---

## 7. Vercel (web)

1. https://vercel.com → "New Project" → import `tiptalkchat`.
2. Framework preset: **Next.js**.
3. **Root Directory: `apps/web`**.
4. Build settings — Vercel reads `apps/web/vercel.json` automatically.
5. Environment variables (Production scope):

   ```
   NEXT_PUBLIC_API_URL=https://<railway-api>
   NEXT_PUBLIC_REALTIME_URL=https://<railway-realtime>
   NEXT_PUBLIC_LIVEKIT_URL=wss://[project].livekit.cloud
   ```

6. Deploy. You should see the landing page at your `.vercel.app` URL.

---

## 8. Wire webhooks back

Now that `api` is live on Railway, go back to:

- **Stripe** dashboard → Webhooks → update endpoint URL to `https://<railway-api>/webhooks/stripe`.
- **Mux** dashboard → Webhooks → update URL to `https://<railway-api>/webhooks/mux`.

---

## 9. Smoke test (in this order)

```bash
# 1. API up
curl https://<railway-api>/healthz

# 2. Login with seeded user
curl -X POST https://<railway-api>/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@tiptalk.demo","password":"demo1234"}'

# 3. Open the deployed web app and:
#    - Sign in as alice@tiptalk.demo / demo1234
#    - Open the demo room /r/fiesta-demo
#    - Type a message → should appear in realtime
#    - Upload an image
#    - Upload a video (Mux processes it in ~30s)
#    - Start a call (LiveKit if SFU_PROVIDER=livekit; P2P otherwise)
```

---

## Cost ballpark (starter / proof of concept)

| Item | Cost |
|---|---|
| Vercel Hobby | $0 |
| Railway 3 services × 0.5GB | ~$5-10/mo |
| Supabase Free | $0 |
| Upstash Free | $0 |
| Mux | pay per minute, ~$0 until you push real video traffic |
| LiveKit Free | $0 |
| Stripe | only fees on real charges |

You're realistically spending **$5-15/mo** until traffic ramps up.

---

## Switching from local-dev to prod

In a fresh checkout to do local dev, all you need is:

```bash
pnpm install
docker compose up -d postgres redis     # or use your Supabase URL + Upstash directly
cp .env.example .env                    # then fill in DATABASE_URL etc.
pnpm --filter @tiptalk/db prisma:generate
pnpm --filter @tiptalk/db db:push
pnpm db:seed
pnpm dev
```
