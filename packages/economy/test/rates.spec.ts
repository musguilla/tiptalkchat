import { describe, expect, it } from 'vitest';
import {
  EUR_TO_TIPSYS_BUY,
  EUR_TO_TIPSYS_SELL,
  PAYOUT_MIN_TIPSYS,
  eurCentsToTipsys,
  formatTipsysAsEur,
  tipsysToEurCents,
} from '../src';

describe('economy: core rates (acceptance from PLAN.md §Economy)', () => {
  it('1 € = 8 Tipsys (purchase rate)', () => {
    expect(EUR_TO_TIPSYS_BUY).toBe(8);
    expect(eurCentsToTipsys(100)).toBe(8);
  });

  it('minimum payout is 300 Tipsys', () => {
    expect(PAYOUT_MIN_TIPSYS).toBe(300);
  });

  it('300 Tipsys = 30,00 € (payout rate)', () => {
    expect(EUR_TO_TIPSYS_SELL).toBe(10);
    expect(tipsysToEurCents(300)).toBe(3000);
    expect(formatTipsysAsEur(300).replace(/\s/g, ' ')).toMatch(/30,00\s?€/);
  });

  it('buy/sell spread documents the implicit platform margin', () => {
    expect(EUR_TO_TIPSYS_BUY).toBeLessThan(EUR_TO_TIPSYS_SELL);
  });
});

describe('economy: purchase rate edge cases', () => {
  it('converts standard packages exactly', () => {
    expect(eurCentsToTipsys(500)).toBe(40);
    expect(eurCentsToTipsys(1000)).toBe(80);
    expect(eurCentsToTipsys(2000)).toBe(160);
    expect(eurCentsToTipsys(5000)).toBe(400);
  });

  it('rejects non-integer cents', () => {
    expect(() => eurCentsToTipsys(99.5)).toThrow(TypeError);
  });

  it('rejects negative cents', () => {
    expect(() => eurCentsToTipsys(-1)).toThrow(TypeError);
  });

  it('rejects amounts that do not divide cleanly into whole Tipsys', () => {
    // 25 cents → 25*8 = 200, 200/100 = 2 — clean
    expect(eurCentsToTipsys(25)).toBe(2);
    // 1 cent → 1*8 = 8, 8/100 = 0.08 — NOT clean, should throw
    expect(() => eurCentsToTipsys(1)).toThrow(RangeError);
  });

  it('zero is allowed and yields zero', () => {
    expect(eurCentsToTipsys(0)).toBe(0);
    expect(tipsysToEurCents(0)).toBe(0);
  });
});

describe('economy: payout rate edge cases (10 Tipsys → 1 €)', () => {
  it('converts clean amounts', () => {
    expect(tipsysToEurCents(10)).toBe(100);
    expect(tipsysToEurCents(100)).toBe(1000);
    expect(tipsysToEurCents(300)).toBe(3000);
    expect(tipsysToEurCents(1)).toBe(10);
  });

  it('rejects negative Tipsys', () => {
    expect(() => tipsysToEurCents(-5)).toThrow(TypeError);
  });

  it('rejects non-integer Tipsys', () => {
    expect(() => tipsysToEurCents(3.5)).toThrow(TypeError);
  });

  it('always yields whole cents at the 10/€ rate (every integer Tipsys works)', () => {
    expect(tipsysToEurCents(7)).toBe(70);
    expect(tipsysToEurCents(13)).toBe(130);
  });
});
