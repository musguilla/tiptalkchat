/**
 * Display helpers for Tipsys ↔ € at the BUY rate (1€ = 8 Tipsys).
 * The actual amounts stored on the ledger are always in Tipsys.
 */

const EUR_TO_TIPSYS = 8;

/** Convert Tipsys to euro cents using the buy rate (used for spender-side display). */
export function tipsysToEurCentsBuy(tipsys: number): number {
  return Math.round((tipsys * 100) / EUR_TO_TIPSYS);
}

/** Convert euro cents to Tipsys (must be a multiple of 100 / EUR_TO_TIPSYS cleanness). */
export function eurCentsToTipsys(eurCents: number): number {
  return Math.round((eurCents * EUR_TO_TIPSYS) / 100);
}

/** Pretty-print a Tipsys amount as € using the buy rate. */
export function formatTipsysAsEur(tipsys: number, locale = 'es-ES'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
  }).format(tipsysToEurCentsBuy(tipsys) / 100);
}

/** Pretty-print euro cents as €. */
export function formatEur(eurCents: number, locale = 'es-ES'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
  }).format(eurCents / 100);
}

/** Tip amounts shown to the user (in € cents). */
export const TIP_BUTTONS: Array<{ eurCents: number; tipsys: number }> = [
  { eurCents: 100, tipsys: 8 },
  { eurCents: 500, tipsys: 40 },
  { eurCents: 1000, tipsys: 80 },
  { eurCents: 2000, tipsys: 160 },
];
