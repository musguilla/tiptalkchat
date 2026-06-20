import { execSync } from 'node:child_process';
import { existsSync, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';

// Use a dedicated SQLite test DB; reset before suite.
const DB_PATH = resolve(process.cwd(), '../../packages/db/prisma/test.db');
process.env.DATABASE_URL = `file:${DB_PATH}`;
process.env.NODE_ENV = 'test';
process.env.JWT_ACCESS_SECRET = 'test_access_secret_32_chars_min__';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_32_chars_min_';
process.env.STRIPE_SECRET_KEY = 'sk_test_dummy';
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_dummy';

if (existsSync(DB_PATH)) {
  try { unlinkSync(DB_PATH); } catch { /* ignore */ }
}

execSync('pnpm --filter @tiptalk/db prisma:generate', {
  stdio: 'inherit',
  env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
});
execSync('pnpm --filter @tiptalk/db db:push --skip-generate', {
  stdio: 'inherit',
  env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
});
