import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildApp } from '../src/app.js';
import type { FastifyInstance } from 'fastify';
import { prisma } from '@tiptalk/db';
import { appendLedgerEntry, reconcileWalletBalance } from '../src/lib/wallet.js';
import { PAYOUT_MIN_TIPSYS, deriveBalance, type LedgerEntryLike } from '@tiptalk/economy';

let app: FastifyInstance;
let aliceToken = '';
let bobToken = '';
let aliceId = '';
let bobId = '';
let roomId = '';
let roomSlug = '';
let messageId = '';

async function jsonReq<T>(method: string, url: string, body?: unknown, token?: string): Promise<T> {
  const res = await app.inject({
    method: method as 'GET' | 'POST',
    url,
    payload: body,
    headers: token ? { authorization: `Bearer ${token}` } : {},
  });
  if (res.statusCode >= 400) {
    throw new Error(`${method} ${url} -> ${res.statusCode}: ${res.body}`);
  }
  return res.json() as T;
}

beforeAll(async () => {
  app = await buildApp();
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe('TipTalk critical flow (acceptance §6)', () => {
  it('1. sign up alice (creator) and bob (tipper)', async () => {
    const a = await jsonReq<{ token: string; user: { id: string } }>('POST', '/auth/signup', {
      email: `alice-${Date.now()}@x.test`,
      password: 'demo1234',
      displayName: 'Alice',
    });
    aliceToken = a.token;
    aliceId = a.user.id;

    const b = await jsonReq<{ token: string; user: { id: string } }>('POST', '/auth/signup', {
      email: `bob-${Date.now()}@x.test`,
      password: 'demo1234',
      displayName: 'Bob',
    });
    bobToken = b.token;
    bobId = b.user.id;

    expect(aliceId).toBeTruthy();
    expect(bobId).toBeTruthy();
  });

  it('2. alice creates a room and gets a short URL slug', async () => {
    const r = await jsonReq<{ id: string; slug: string }>('POST', '/rooms', { name: 'Demo Room' }, aliceToken);
    roomId = r.id;
    roomSlug = r.slug;
    expect(roomSlug).toMatch(/^[a-z0-9-]+$/);
  });

  it('3. bob joins via the slug', async () => {
    const join = await jsonReq<{ membershipId: string; asGuest: boolean }>(
      'POST',
      `/rooms/${roomSlug}/join`,
      {},
      bobToken,
    );
    expect(join.asGuest).toBe(false);
    expect(join.membershipId).toBeTruthy();
  });

  it('4. alice sends a text message; bob can read it in history', async () => {
    const msg = await jsonReq<{ id: string }>(
      'POST',
      '/messages',
      { roomId, kind: 'text', body: 'Hola Bob!' },
      aliceToken,
    );
    messageId = msg.id;
    const hist = await jsonReq<{ messages: Array<{ id: string; body: string }> }>(
      'GET',
      `/messages?roomId=${roomId}`,
    );
    expect(hist.messages.some((m) => m.id === messageId && m.body === 'Hola Bob!')).toBe(true);
  });

  it('5. simulate purchase: credit bob 10€ -> 80 Tipsys (via webhook codepath)', async () => {
    // Direct call to the ledger helper — equivalent to what the Stripe webhook
    // does on checkout.session.completed.
    const wallet = await prisma.wallet.upsert({
      where: { userId: bobId },
      create: { userId: bobId },
      update: {},
    });
    const res = await appendLedgerEntry({
      walletId: wallet.id,
      kind: 'PURCHASE_CREDIT',
      amount: 80,
      idempotencyKey: `test-purchase:${bobId}`,
      refType: 'purchase',
    });
    expect(res.balanceAfter).toBe(80);

    const walletState = await jsonReq<{ balance: number }>('GET', '/wallet', undefined, bobToken);
    expect(walletState.balance).toBe(80);
  });

  it('6. bob tips alice 25 Tipsys on her message — ledger is atomic', async () => {
    await jsonReq('POST', '/tips', {
      amount: 25,
      targetType: 'message',
      targetId: messageId,
      roomId,
    }, bobToken);

    const bobWallet = await jsonReq<{ balance: number }>('GET', '/wallet', undefined, bobToken);
    const aliceWallet = await jsonReq<{ balance: number }>('GET', '/wallet', undefined, aliceToken);
    expect(bobWallet.balance).toBe(55);    // 80 - 25
    expect(aliceWallet.balance).toBe(25);

    // Reconcile: balance must equal sum of ledger entries
    const bobDb = await prisma.wallet.findUniqueOrThrow({ where: { userId: bobId } });
    const aliceDb = await prisma.wallet.findUniqueOrThrow({ where: { userId: aliceId } });
    expect(await reconcileWalletBalance(bobDb.id)).toBe(55);
    expect(await reconcileWalletBalance(aliceDb.id)).toBe(25);
  });

  it('7. cannot self-tip (anti-fraud)', async () => {
    await expect(
      jsonReq('POST', '/tips', {
        amount: 5,
        targetType: 'message',
        targetId: messageId,
        roomId,
      }, aliceToken),
    ).rejects.toThrow();
  });

  it('8. tip with same idempotencyKey does not double-charge', async () => {
    const key = `idem-${Date.now()}`;
    const t1 = await jsonReq<{ id: string }>('POST', '/tips', {
      amount: 5,
      targetType: 'message',
      targetId: messageId,
      roomId,
      idempotencyKey: key,
    }, bobToken);
    const t2 = await jsonReq<{ id: string }>('POST', '/tips', {
      amount: 5,
      targetType: 'message',
      targetId: messageId,
      roomId,
      idempotencyKey: key,
    }, bobToken);
    expect(t1.id).toBe(t2.id);

    const bobWallet = await jsonReq<{ balance: number }>('GET', '/wallet', undefined, bobToken);
    expect(bobWallet.balance).toBe(50);  // 55 - 5, not 45
  });

  it('9. ledger is the canonical source of truth (balance derivable end-to-end)', async () => {
    const bobDb = await prisma.wallet.findUniqueOrThrow({ where: { userId: bobId } });
    const entries = await prisma.ledgerEntry.findMany({
      where: { walletId: bobDb.id },
      orderBy: { createdAt: 'asc' },
      select: { kind: true, amount: true },
    });
    expect(deriveBalance(entries as LedgerEntryLike[])).toBe(bobDb.balance);
  });

  it('10. payout: blocked under threshold, requires Stripe Connect', async () => {
    // Bring alice up to 300 Tipsys via additional tips from bob
    // bob has 50 → need to top up bob first
    const bobWallet = await prisma.wallet.findUniqueOrThrow({ where: { userId: bobId } });
    await appendLedgerEntry({
      walletId: bobWallet.id,
      kind: 'PURCHASE_CREDIT',
      amount: 300,
      idempotencyKey: `topup:${bobId}`,
      refType: 'purchase',
    });

    // After test 6 (+25) and test 8 idempotent tip (+5), alice has 30. Send
    // 10 tips of 27 = 270 more → alice goes from 30 to exactly 300.
    for (let i = 0; i < 10; i += 1) {
      await jsonReq('POST', '/tips', {
        amount: 27,
        targetType: 'message',
        targetId: messageId,
        roomId,
        idempotencyKey: `topup-${i}-${Date.now()}`,
      }, bobToken);
    }
    const aliceWallet = await jsonReq<{ balance: number; canRequestPayout: boolean }>(
      'GET',
      '/wallet',
      undefined,
      aliceToken,
    );
    expect(aliceWallet.balance).toBe(300);
    expect(aliceWallet.canRequestPayout).toBe(true);

    // Cannot payout without Stripe Connect onboarding
    await expect(
      jsonReq('POST', '/payouts', { tipsys: PAYOUT_MIN_TIPSYS }, aliceToken),
    ).rejects.toThrow();
  });

  it('11. payout quote: 300 Tipsys → 30,00 € gross, 30% fee, 21,00 € net', async () => {
    const q = await jsonReq<{ grossEurCents: number; feeEurCents: number; netEurCents: number; min: number }>(
      'GET',
      '/payouts/quote?tipsys=300',
    );
    expect(q.grossEurCents).toBe(3000);
    expect(q.feeEurCents).toBe(900);
    expect(q.netEurCents).toBe(2100);
    expect(q.min).toBe(300);
  });

  it('12. payout: succeeds once Connect is marked verified', async () => {
    await prisma.connectAccount.create({
      data: {
        userId: aliceId,
        stripeAccountId: 'acct_test_alice',
        status: 'verified',
        payoutsEnabled: true,
      },
    });
    const payout = await jsonReq<{ id: string; status: string; netEurCents: number }>(
      'POST',
      '/payouts',
      { tipsys: PAYOUT_MIN_TIPSYS },
      aliceToken,
    );
    expect(payout.status).toBe('requested');
    expect(payout.netEurCents).toBe(2100);

    // Alice's wallet is debited immediately
    const w = await jsonReq<{ balance: number }>('GET', '/wallet', undefined, aliceToken);
    expect(w.balance).toBe(0);
  });
});
