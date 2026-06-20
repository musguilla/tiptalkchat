import { execSync } from 'node:child_process';

/**
 * Integration tests require a real Postgres because the schema's provider is
 * 'postgresql'. The test runner expects DATABASE_URL_TEST pointing at a clean,
 * dedicated database — DO NOT point this at a production DB; the suite truncates
 * tables on startup.
 *
 * Locally:
 *   docker run --rm -d -e POSTGRES_PASSWORD=tip -e POSTGRES_USER=tip \
 *     -e POSTGRES_DB=tiptalk_test -p 5433:5432 postgres:16
 *   export DATABASE_URL_TEST=postgresql://tip:tip@localhost:5433/tiptalk_test
 *
 * In CI: see .github/workflows/ci.yml — a Postgres service container is set up.
 */
const testDbUrl = process.env.DATABASE_URL_TEST ?? process.env.DATABASE_URL;
if (!testDbUrl || !testDbUrl.startsWith('postgres')) {
  // eslint-disable-next-line no-console
  console.warn(
    '\n[test setup] DATABASE_URL_TEST not set to a Postgres URL — integration tests will fail.\n' +
      '             Spin one up with:\n' +
      '             docker run --rm -d -e POSTGRES_PASSWORD=tip -e POSTGRES_USER=tip \\\n' +
      '               -e POSTGRES_DB=tiptalk_test -p 5433:5432 postgres:16\n' +
      '             export DATABASE_URL_TEST=postgresql://tip:tip@localhost:5433/tiptalk_test\n',
  );
}
process.env.DATABASE_URL = testDbUrl ?? '';
process.env.NODE_ENV = 'test';
process.env.JWT_ACCESS_SECRET = 'test_access_secret_32_chars_min__';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_32_chars_min_';
process.env.STRIPE_SECRET_KEY = 'sk_test_dummy';
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_dummy';

execSync('pnpm --filter @tiptalk/db prisma:generate', {
  stdio: 'inherit',
  env: process.env,
});
execSync('pnpm --filter @tiptalk/db db:push --force-reset --accept-data-loss', {
  stdio: 'inherit',
  env: process.env,
});
