import type { FastifyInstance } from 'fastify';
import Stripe from 'stripe';
import { prisma } from '@tiptalk/db';
import { loadEnv } from '@tiptalk/config';

/**
 * Stripe Connect onboarding, pre-configured to strip out every question a
 * private individual can't answer.
 *
 * Stripe's default flow is built for businesses: it asks for a company
 * website, a legal entity type, a merchant category and a description of the
 * business model. Our sellers are individuals who just want to receive tips,
 * and each of those questions is a place to abandon the flow. So we fill them
 * in ourselves when creating the account and the user only ever sees the
 * legally-mandatory KYC: their name, their ID document and their IBAN.
 */

/**
 * Merchant Category Code. 8999 = "Professional services, not elsewhere
 * classified" — the standard bucket for marketplaces where individuals are
 * paid for their time (advice, classes, coaching, conversation).
 *
 * Deliberately NOT a digital-goods code: nothing is downloaded or delivered
 * as a file, so the transaction pattern (many small voluntary tips, no
 * deliverable) would not match and could trip a Stripe review later.
 */
const CONNECT_MCC = '8999';

/**
 * The mandatory "what do you sell" description, written for the user. Says
 * plainly what the money is for so a Stripe reviewer sees the same thing the
 * transactions show.
 */
/**
 * The marketplace URL we declare to Stripe as the seller's business site.
 * Hard-coded on purpose: it is a fact about the business, not about where
 * this process happens to run. Deriving it from PUBLIC_BASE_URL would send
 * Stripe a staging hostname from a staging deploy — and `localhost` from a
 * dev machine, which Stripe rejects outright with "Not a valid URL".
 */
const MARKETPLACE_URL = 'https://tiptalk.chat';

const CONNECT_PRODUCT_DESCRIPTION =
  'Conversaciones privadas uno a uno por texto, voz y vídeo a través de la plataforma tiptalk.chat. Los ingresos proceden de propinas voluntarias enviadas por los participantes durante la conversación.';

export async function connectRoutes(app: FastifyInstance): Promise<void> {
  const env = loadEnv();
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);

  app.post('/onboard', async (req, reply) => {
    const { userId } = await app.requireUser(req);
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

    let connect = await prisma.connectAccount.findUnique({ where: { userId } });
    if (!connect) {
      const account = await stripe.accounts.create({
        // Express: Stripe hosts a short, marketplace-oriented flow instead of
        // handing the user the full Stripe dashboard.
        type: 'express',
        email: user.email,
        // Everyone here is a private individual. Fixing this skips the
        // "are you an LLC / SA?" branch and the corporate paperwork with it.
        business_type: 'individual',
        capabilities: { transfers: { requested: true } },
        business_profile: {
          // Stripe requires a URL for every seller. Ours don't have their own
          // site, so we send the marketplace they sell through.
          url: MARKETPLACE_URL,
          mcc: CONNECT_MCC,
          product_description: CONNECT_PRODUCT_DESCRIPTION,
          name: user.displayName,
        },
        // Prefill what we already know. We deliberately do NOT prefill the
        // legal name: displayName is a nickname, and a wrong name here means
        // the user has to undo it during KYC.
        individual: { email: user.email },
        metadata: { tiptalkUserId: userId },
      });
      connect = await prisma.connectAccount.create({
        data: { userId, stripeAccountId: account.id, status: 'onboarding' },
      });
    }

    const link = await stripe.accountLinks.create({
      account: connect.stripeAccountId,
      // Land back on their own profile, where the payout status lives.
      refresh_url: `${env.PUBLIC_BASE_URL}/u/${userId}?connect=refresh`,
      return_url: `${env.PUBLIC_BASE_URL}/u/${userId}?connect=done`,
      type: 'account_onboarding',
    });

    reply.code(201);
    return { url: link.url, accountId: connect.stripeAccountId };
  });

  /**
   * Express dashboard link, so a already-onboarded user can review their
   * details or change their bank account without leaving through onboarding.
   */
  app.post('/dashboard', async (req) => {
    const { userId } = await app.requireUser(req);
    const connect = await prisma.connectAccount.findUnique({ where: { userId } });
    if (!connect) throw app.httpErrors.notFound('No hay cuenta de cobros conectada');
    const link = await stripe.accounts.createLoginLink(connect.stripeAccountId);
    return { url: link.url };
  });

  /**
   * Live status. Reads from Stripe rather than trusting the cached row, so a
   * user who just finished onboarding doesn't sit looking at "pendiente"
   * while waiting for the account.updated webhook. Falls back to the DB copy
   * if Stripe is unreachable.
   */
  app.get('/status', async (req) => {
    const { userId } = await app.requireUser(req);
    const connect = await prisma.connectAccount.findUnique({ where: { userId } });
    if (!connect) return { connected: false, status: null, payoutsEnabled: false, pending: [] };

    try {
      const account = await stripe.accounts.retrieve(connect.stripeAccountId);
      const payoutsEnabled = account.payouts_enabled ?? false;
      const status = payoutsEnabled
        ? 'verified'
        : account.requirements?.disabled_reason
          ? 'onboarding'
          : connect.status;

      if (payoutsEnabled !== connect.payoutsEnabled || status !== connect.status) {
        await prisma.connectAccount.update({
          where: { id: connect.id },
          data: { payoutsEnabled, status },
        });
      }

      return {
        connected: true,
        status,
        payoutsEnabled,
        detailsSubmitted: account.details_submitted ?? false,
        // What Stripe is still waiting for, so the UI can say "te falta X"
        // instead of a bare "pendiente".
        pending: account.requirements?.currently_due ?? [],
      };
    } catch (err) {
      req.log.warn({ err }, '[connect] status refresh from Stripe failed');
      return {
        connected: true,
        status: connect.status,
        payoutsEnabled: connect.payoutsEnabled,
        detailsSubmitted: false,
        pending: [],
      };
    }
  });
}
