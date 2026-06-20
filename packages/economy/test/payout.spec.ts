import { describe, expect, it } from 'vitest';
import {
  InsufficientTipsysForPayoutError,
  PAYOUT_MIN_TIPSYS,
  assertCanRequestPayout,
  canRequestPayout,
  quotePayout,
} from '../src';

describe('payout: eligibility', () => {
  it('allows payout at exactly 300 Tipsys', () => {
    expect(canRequestPayout(300)).toBe(true);
  });

  it('rejects payout below 300 Tipsys', () => {
    expect(canRequestPayout(299)).toBe(false);
    expect(canRequestPayout(0)).toBe(false);
  });

  it('uses configurable minimum if provided', () => {
    expect(canRequestPayout(50, 50)).toBe(true);
    expect(canRequestPayout(49, 50)).toBe(false);
  });

  it('assertCanRequestPayout throws below threshold', () => {
    expect(() => assertCanRequestPayout(100)).toThrow(InsufficientTipsysForPayoutError);
  });

  it('exposes available and required on error', () => {
    try {
      assertCanRequestPayout(100);
      throw new Error('should not reach');
    } catch (err) {
      expect(err).toBeInstanceOf(InsufficientTipsysForPayoutError);
      expect((err as InsufficientTipsysForPayoutError).available).toBe(100);
      expect((err as InsufficientTipsysForPayoutError).required).toBe(PAYOUT_MIN_TIPSYS);
    }
  });
});

describe('payout: quote breakdown', () => {
  it('300 Tipsys gross is 30,00 € (gross before fee)', () => {
    const q = quotePayout(300, 0);
    expect(q.grossEurCents).toBe(3000);
    expect(q.feeEurCents).toBe(0);
    expect(q.netEurCents).toBe(3000);
  });

  it('applies 30% platform fee by default', () => {
    const q = quotePayout(300);
    expect(q.feePct).toBe(0.3);
    expect(q.grossEurCents).toBe(3000);
    expect(q.feeEurCents).toBe(900);
    expect(q.netEurCents).toBe(2100);
  });

  it('rounds fee down to favour the creator at the sub-cent level', () => {
    // 10 Tipsys gross = 100 cents at sell rate, 33% fee = 33 cents (floor of 33.0)
    const q = quotePayout(10, 0.33);
    expect(q.grossEurCents).toBe(100);
    expect(q.feeEurCents).toBe(33);
    expect(q.netEurCents).toBe(67);
  });

  it('fee is floored (creator never short by sub-cent rounding)', () => {
    // 11 Tipsys → 110 cents, 1% fee = floor(1.10) = 1 cent
    const q = quotePayout(11, 0.01);
    expect(q.grossEurCents).toBe(110);
    expect(q.feeEurCents).toBe(1);
    expect(q.netEurCents).toBe(109);
  });

  it('rejects negative tipsys', () => {
    expect(() => quotePayout(-1)).toThrow(TypeError);
  });

  it('rejects non-integer tipsys', () => {
    expect(() => quotePayout(300.5)).toThrow(TypeError);
  });

  it('rejects fee outside [0, 1)', () => {
    expect(() => quotePayout(300, -0.1)).toThrow(RangeError);
    expect(() => quotePayout(300, 1)).toThrow(RangeError);
    expect(() => quotePayout(300, 1.2)).toThrow(RangeError);
  });
});
