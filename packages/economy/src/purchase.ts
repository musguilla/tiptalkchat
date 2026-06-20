import { TIP_PACKAGES, type TipPackage } from './constants';
import { eurCentsToTipsys } from './rates';

export function listPackages(): readonly TipPackage[] {
  return TIP_PACKAGES;
}

export function findPackageByEurCents(eurCents: number): TipPackage | undefined {
  return TIP_PACKAGES.find((p) => p.eurCents === eurCents);
}

/**
 * Compute Tipsys credited for an arbitrary euro-cents purchase. Custom (non-package)
 * amounts are allowed but must convert cleanly to whole Tipsys at the purchase rate.
 */
export function tipsysForPurchase(eurCents: number): number {
  return eurCentsToTipsys(eurCents);
}
