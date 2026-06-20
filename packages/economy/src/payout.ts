import { DEFAULT_PLATFORM_FEE_PCT, PAYOUT_MIN_TIPSYS } from './constants';
import { tipsysToEurCents } from './rates';

export interface PayoutQuote {
  tipsys: number;
  grossEurCents: number;
  feeEurCents: number;
  netEurCents: number;
  feePct: number;
}

/**
 * Compute the payout breakdown for a creator request.
 *
 * `tipsys` is the requested amount in Tipsys. The platform fee is taken from
 * the gross euro amount (banker's-rounded down to the nearest cent in the
 * platform's favour — creator never receives a fraction of a cent more than
 * earned).
 */
export function quotePayout(
  tipsys: number,
  feePct: number = DEFAULT_PLATFORM_FEE_PCT,
): PayoutQuote {
  if (!Number.isInteger(tipsys) || tipsys < 0) {
    throw new TypeError(`tipsys must be a non-negative integer (got ${tipsys})`);
  }
  if (feePct < 0 || feePct >= 1) {
    throw new RangeError(`feePct must be in [0, 1) (got ${feePct})`);
  }
  const grossEurCents = tipsysToEurCents(tipsys);
  const feeEurCents = Math.floor(grossEurCents * feePct);
  const netEurCents = grossEurCents - feeEurCents;
  return { tipsys, grossEurCents, feeEurCents, netEurCents, feePct };
}

export function canRequestPayout(
  availableTipsys: number,
  minTipsys: number = PAYOUT_MIN_TIPSYS,
): boolean {
  return availableTipsys >= minTipsys;
}

export class InsufficientTipsysForPayoutError extends Error {
  readonly code = 'INSUFFICIENT_TIPSYS_FOR_PAYOUT';
  constructor(public available: number, public required: number) {
    super(`Need at least ${required} Tipsys to request payout (available: ${available})`);
  }
}

export function assertCanRequestPayout(
  availableTipsys: number,
  minTipsys: number = PAYOUT_MIN_TIPSYS,
): void {
  if (!canRequestPayout(availableTipsys, minTipsys)) {
    throw new InsufficientTipsysForPayoutError(availableTipsys, minTipsys);
  }
}
