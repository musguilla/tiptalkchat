import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.spec.ts'],
    pool: 'forks', // ensure SQLite DB lifecycle doesn't leak across runs
    poolOptions: { forks: { singleFork: true } },
    testTimeout: 30_000,
    setupFiles: ['./test/setup.ts'],
  },
});
