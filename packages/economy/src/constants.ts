/**
 * Single source of truth for Tipsys economic rules.
 *
 * All amounts are integers:
 *  - `tipsys` are whole Tipsy units (the virtual currency)
 *  - `cents` are whole euro cents (€1.00 == 100 cents)
 *
 * Never store money as floats anywhere outside this module.
 */

/**
 * Purchase rate: 1 € → 8 Tipsys when buying.
 * Used for Stripe Checkout package pricing and ad-hoc top-ups.
 */
export const EUR_TO_TIPSYS_BUY = 8 as const;

/**
 * Payout rate: 10 Tipsys → 1 € when cashing out (so 300 Tipsys → 30,00 €).
 *
 * The spread between buy (8/€) and sell (10/€) is an implicit platform margin
 * on every round trip (1 € in → 8 Tipsys; 8 Tipsys out → 0,80 €). The
 * configurable `PLATFORM_FEE_PCT` is applied on TOP of this spread.
 *
 * This deliberate split is the canonical source of truth for the rule
 * "300 Tipsys = 30 €" required by the spec.
 */
export const EUR_TO_TIPSYS_SELL = 10 as const;

/** Back-compat alias used by older callers; resolves to the purchase rate. */
export const EUR_TO_TIPSYS = EUR_TO_TIPSYS_BUY;

export const PAYOUT_MIN_TIPSYS = 300 as const;

export const DEFAULT_PLATFORM_FEE_PCT = 0.3 as const;

export const TIP_PACKAGES = [
  { eurCents: 500, tipsys: 40 },
  { eurCents: 1000, tipsys: 80 },
  { eurCents: 2000, tipsys: 160 },
  { eurCents: 5000, tipsys: 400 },
] as const;

export type TipPackage = (typeof TIP_PACKAGES)[number];
