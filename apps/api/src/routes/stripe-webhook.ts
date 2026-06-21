import type { FastifyInstance } from 'fastify';
import Stripe from 'stripe';
import { prisma } from '@tiptalk/db';
import { loadEnv } from '@tiptalk/config';
import { appendLedgerEntry, getOrCreateWallet } from '../lib/wallet.js';

export async function stripeWebhookRoute(app: FastifyInstance): Promise<void> {
  const env = loadEnv();
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);

  // Stripe sends the body as raw bytes; we need to read it before parsing.
  app.addContentTypeParser(
    'application/json',
    { parseAs: 'buffer' },
    (_req, body, done) => done(null, body),
  );

  app.post('/', async (req, reply) => {
    const sig = req.headers['stripe-signature'];
    if (!sig || typeof sig !== 'string') {
      throw app.httpErrors.badRequest('Missing stripe-signature header');
    }
    const rawBody = req.body as Buffer;

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      app.log.warn({ err }, 'Invalid Stripe webhook signature');
      throw app.httpErrors.badRequest('Invalid signature');
    }

    // Idempotency: track delivered event IDs in AuditLog
    const seen = await prisma.auditLog.findFirst({
      where: { action: 'stripe.webhook', meta: { contains: event.id } },
    });
    if (seen) {
      reply.code(200);
      return { received: true, duplicate: true };
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const kind = session.metadata?.kind ?? 'purchase';

        if (kind === 'guest-tip') {
          const receiverId = session.metadata?.receiverId;
          const tipsys = Number(session.metadata?.tipsys);
          const roomId = session.metadata?.roomId;
          const targetType = session.metadata?.targetType;
          const targetId = session.metadata?.targetId;
          const senderEmail = session.metadata?.senderEmail ?? null;
          const note = session.metadata?.note || null;
          if (
            !receiverId ||
            !Number.isInteger(tipsys) ||
            tipsys <= 0 ||
            !roomId ||
            !targetType ||
            !targetId
          )
            break;

          await prisma.$transaction(async (tx) => {
            const wallet = await tx.wallet.upsert({
              where: { userId: receiverId },
              create: { userId: receiverId },
              update: {},
            });
            // The receiver gets a TIP_RECEIVED entry (no sender wallet exists)
            await appendLedgerEntry({
              walletId: wallet.id,
              kind: 'TIP_RECEIVED',
              amount: tipsys,
              idempotencyKey: `stripe-guest-tip:${session.id}`,
              refType: 'tip',
              refId: session.id,
              tx,
            });
            await tx.tip.create({
              data: {
                senderId: null,
                senderGuestId: null,
                senderEmail,
                receiverId,
                roomId,
                amount: tipsys,
                targetType,
                targetId,
                note,
                idempotencyKey: `stripe-guest-tip:${session.id}`,
              },
            });
          });
          break;
        }

        // Default: regular Tipsys purchase
        const userId = session.metadata?.userId;
        const tipsys = Number(session.metadata?.tipsys);
        if (!userId || !Number.isInteger(tipsys) || tipsys <= 0) break;

        await prisma.$transaction(async (tx) => {
          await tx.purchase.update({
            where: { stripeSessionId: session.id },
            data: {
              status: 'paid',
              stripePaymentIntent:
                typeof session.payment_intent === 'string'
                  ? session.payment_intent
                  : session.payment_intent?.id,
            },
          });
          const wallet = await getOrCreateWallet(userId);
          await appendLedgerEntry({
            walletId: wallet.id,
            kind: 'PURCHASE_CREDIT',
            amount: tipsys,
            idempotencyKey: `stripe-checkout:${session.id}`,
            refType: 'purchase',
            refId: session.id,
            tx,
          });
        });
        break;
      }

      case 'account.updated': {
        const account = event.data.object as Stripe.Account;
        await prisma.connectAccount.updateMany({
          where: { stripeAccountId: account.id },
          data: {
            payoutsEnabled: account.payouts_enabled ?? false,
            status: account.payouts_enabled ? 'verified' : 'onboarding',
          },
        });
        break;
      }

      case 'transfer.created': {
        const transfer = event.data.object as Stripe.Transfer;
        const payoutId = transfer.metadata?.payoutId;
        if (payoutId) {
          await prisma.payoutRequest.update({
            where: { id: payoutId },
            data: { status: 'paid', paidAt: new Date(), stripeTransferId: transfer.id },
          });
        }
        break;
      }

      case 'payout.failed': {
        const transfer = event.data.object as Stripe.Payout;
        const payoutId = transfer.metadata?.payoutId;
        if (payoutId) {
          const payout = await prisma.payoutRequest.findUnique({ where: { id: payoutId } });
          if (payout && payout.status !== 'failed') {
            await prisma.$transaction(async (tx) => {
              await tx.payoutRequest.update({
                where: { id: payoutId },
                data: { status: 'failed', failureReason: 'transfer.failed' },
              });
              const wallet = await getOrCreateWallet(payout.userId);
              // Refund the held Tipsys
              await appendLedgerEntry({
                walletId: wallet.id,
                kind: 'PAYOUT_REFUND',
                amount: payout.tipsys,
                idempotencyKey: `payout:${payoutId}:refund`,
                refType: 'payout',
                refId: payoutId,
                tx,
              });
            });
          }
        }
        break;
      }
      default:
        // ignore unknown event types
        break;
    }

    await prisma.auditLog.create({
      data: { action: 'stripe.webhook', meta: JSON.stringify({ id: event.id, type: event.type }) },
    });

    reply.code(200);
    return { received: true };
  });
}
