import { z } from 'zod';
import { config as loadDotenv } from 'dotenv';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

/**
 * Walk up from cwd looking for a .env file at the monorepo root and load it
 * into process.env. Called once at module load so any app importing from
 * `@tiptalk/config` gets the root env without remembering to wire dotenv.
 */
function loadRootDotenv(): void {
  let dir = process.cwd();
  for (let i = 0; i < 8; i += 1) {
    if (existsSync(resolve(dir, 'pnpm-workspace.yaml'))) {
      const envPath = resolve(dir, '.env');
      if (existsSync(envPath)) loadDotenv({ path: envPath });
      return;
    }
    const parent = dirname(dir);
    if (parent === dir) return;
    dir = parent;
  }
}
loadRootDotenv();

const baseSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  WEB_URL: z.string().url().default('http://localhost:3000'),
  API_URL: z.string().url().default('http://localhost:4000'),
  REALTIME_URL: z.string().url().default('http://localhost:4001'),
  PUBLIC_BASE_URL: z.string().url().default('http://localhost:3000'),

  DATABASE_URL: z.string().default('file:./prisma/dev.db'),
  REDIS_URL: z.string().default('redis://localhost:6379'),

  JWT_ACCESS_SECRET: z.string().min(16).default('dev_access_secret_change_me_please'),
  JWT_REFRESH_SECRET: z.string().min(16).default('dev_refresh_secret_change_me_please'),
  JWT_ACCESS_TTL: z.string().default('15m'),
  JWT_REFRESH_TTL: z.string().default('30d'),

  // --- Storage (for images) ---
  // Provider is auto-selected: 'supabase' if SUPABASE_URL+SUPABASE_SERVICE_KEY,
  // else 'r2' if R2 creds, else 's3' (MinIO-compatible) by default.
  STORAGE_PROVIDER: z.enum(['supabase', 'r2', 's3']).optional(),

  // Supabase Storage
  SUPABASE_URL: z.string().optional(),
  SUPABASE_SERVICE_KEY: z.string().optional(),
  SUPABASE_BUCKET: z.string().default('tiptalk-media'),
  SUPABASE_PROFILE_BUCKET: z.string().default('profiles'),

  // S3 / R2 / MinIO (S3-compatible)
  S3_ENDPOINT: z.string().default('http://localhost:9000'),
  S3_REGION: z.string().default('us-east-1'),
  S3_BUCKET: z.string().default('tiptalk-media'),
  S3_ACCESS_KEY: z.string().default('minioadmin'),
  S3_SECRET_KEY: z.string().default('minioadmin'),
  S3_PUBLIC_URL: z.string().default('http://localhost:9000/tiptalk-media'),

  // --- Video pipeline ---
  // 'mux' uses Mux Direct Upload + webhooks (production).
  // 'local' uses the apps/worker ffmpeg pipeline (dev fallback).
  VIDEO_PROVIDER: z.enum(['mux', 'local']).default('local'),
  MUX_TOKEN_ID: z.string().optional(),
  MUX_TOKEN_SECRET: z.string().optional(),
  MUX_WEBHOOK_SECRET: z.string().optional(),

  // --- WebRTC SFU ---
  // 'p2p' (default) uses signaling-only with browser RTCPeerConnection + coturn.
  // 'livekit' issues access tokens for a LiveKit Cloud room (group calls + TURN).
  SFU_PROVIDER: z.enum(['p2p', 'livekit']).default('p2p'),
  LIVEKIT_URL: z.string().optional(),
  LIVEKIT_API_KEY: z.string().optional(),
  LIVEKIT_API_SECRET: z.string().optional(),

  // --- Stripe ---
  STRIPE_SECRET_KEY: z.string().default('sk_test_placeholder'),
  STRIPE_WEBHOOK_SECRET: z.string().default('whsec_placeholder'),
  STRIPE_CONNECT_CLIENT_ID: z.string().default('ca_placeholder'),

  PLATFORM_FEE_PCT: z.coerce.number().min(0).max(1).default(0.3),
  PAYOUT_MIN_TIPSYS: z.coerce.number().int().positive().default(300),

  TURN_URL: z.string().default('turn:localhost:3478'),
  TURN_USERNAME: z.string().default('tiptalk'),
  TURN_CREDENTIAL: z.string().default('tiptalkpass'),
  STUN_URL: z.string().default('stun:stun.l.google.com:19302'),

  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  RATE_LIMIT_PER_MIN: z.coerce.number().int().positive().default(120),
  MAX_MEDIA_BYTES: z.coerce.number().int().positive().default(50 * 1024 * 1024),
});

export type Env = z.infer<typeof baseSchema>;

let cached: Env | null = null;

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  if (cached) return cached;
  const parsed = baseSchema.safeParse(source);
  if (!parsed.success) {
    // eslint-disable-next-line no-console
    console.error('Invalid environment variables:\n', parsed.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables');
  }
  cached = parsed.data;
  return cached;
}

export function resetEnvCache(): void {
  cached = null;
}
