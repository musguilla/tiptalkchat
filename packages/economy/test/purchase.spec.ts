import { describe, expect, it } from 'vitest';
import { TIP_PACKAGES, findPackageByEurCents, listPackages, tipsysForPurchase } from '../src';

describe('purchase: packages', () => {
  it('lists the configured packages', () => {
    const pkgs = listPackages();
    expect(pkgs).toEqual(TIP_PACKAGES);
    expect(pkgs.length).toBeGreaterThanOrEqual(3);
  });

  it('all packages credit the right amount at 1€ = 8 Tipsys', () => {
    for (const p of TIP_PACKAGES) {
      expect(tipsysForPurchase(p.eurCents)).toBe(p.tipsys);
    }
  });

  it('finds package by exact euro-cents amount', () => {
    expect(findPackageByEurCents(1000)).toEqual({ eurCents: 1000, tipsys: 80 });
    expect(findPackageByEurCents(7)).toBeUndefined();
  });
});
