import { EUR_TO_TIPSYS_BUY, EUR_TO_TIPSYS_SELL } from './constants';

/**
 * Convert euro cents into Tipsys at the PURCHASE rate (1 € → 8 Tipsys).
 * Throws if input is not a non-negative integer or does not yield whole Tipsys.
 */
export function eurCentsToTipsys(eurCents: number): number {
  assertNonNegativeInt(eurCents, 'eurCents');
  const tipsysScaled = eurCents * EUR_TO_TIPSYS_BUY;
  if (tipsysScaled % 100 !== 0) {
    throw new RangeError(
      `eurCents=${eurCents} does not convert to a whole number of Tipsys at rate ${EUR_TO_TIPSYS_BUY}/€`,
    );
  }
  return tipsysScaled / 100;
}

/**
 * Convert Tipsys into euro cents at the PAYOUT rate (10 Tipsys → 1 €).
 *
 * 300 Tipsys → 30,00 € (3000 cents). This is the canonical payout conversion
 * required by the product spec.
 */
export function tipsysToEurCents(tipsys: number): number {
  assertNonNegativeInt(tipsys, 'tipsys');
  const centsScaled = tipsys * 100;
  if (centsScaled % EUR_TO_TIPSYS_SELL !== 0) {
    throw new RangeError(
      `tipsys=${tipsys} does not convert to whole cents at rate ${EUR_TO_TIPSYS_SELL}/€`,
    );
  }
  return centsScaled / EUR_TO_TIPSYS_SELL;
}

/**
 * Format a Tipsys amount as a EUR string like "30,00 €" (Spanish locale).
 */
export function formatTipsysAsEur(tipsys: number): string {
  const cents = tipsysToEurCents(tipsys);
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
}

function assertNonNegativeInt(value: number, name: string): void {
  if (!Number.isInteger(value) || value < 0) {
    throw new TypeError(`${name} must be a non-negative integer (got ${value})`);
  }
}
