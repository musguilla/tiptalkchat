import { test, expect } from '@playwright/test';

/**
 * Critical-flow E2E (acceptance §6).
 *
 * Prerequisites (CI orchestrates these):
 *   - API server running on http://localhost:4000
 *   - Realtime on http://localhost:4001
 *   - Web on http://localhost:3000
 *   - DB seeded (alice/bob @ tiptalk.demo / demo1234)
 *
 * What it exercises end-to-end:
 *   1. Landing renders
 *   2. Login as alice
 *   3. Create a room and end up on /r/:slug
 *   4. Send a chat message
 *   5. Open the wallet — balance is shown
 *
 * The Stripe checkout redirect and Connect onboarding are NOT exercised here
 * (they require real Stripe test mode); see `apps/api/test/flow.spec.ts` for
 * the full tipping & payout flow against the API.
 */

test.describe('TipTalk critical flow', () => {
  test('landing → login → create room → chat → wallet', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /TipTalk/i })).toBeVisible();

    await page.getByRole('link', { name: /Iniciar sesión/i }).click();
    await page.fill('input[type=email]', 'alice@tiptalk.demo');
    await page.fill('input[type=password]', 'demo1234');
    await page.getByRole('button', { name: /Iniciar sesión/i }).click();

    await expect(page).toHaveURL(/\/create/);
    await page.fill('input', 'E2E Test Room');
    await page.getByRole('button', { name: /Crear sala/i }).click();

    await expect(page).toHaveURL(/\/r\//);
    const slug = new URL(page.url()).pathname.replace('/r/', '');
    expect(slug.length).toBeGreaterThan(2);

    await page.fill('input[placeholder*="mensaje" i]', 'hola desde Playwright');
    await page.keyboard.press('Enter');
    await expect(page.getByText('hola desde Playwright').first()).toBeVisible();

    await page.getByRole('link', { name: /Monedero/i }).click();
    await expect(page).toHaveURL(/\/wallet/);
    await expect(page.getByText(/Tipsys/i).first()).toBeVisible();
  });
});
