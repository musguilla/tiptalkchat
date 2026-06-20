import { describe, expect, it } from 'vitest';
import {
  InsufficientBalanceError,
  LEDGER_SIGN,
  assertSufficientBalance,
  buildTransferEntries,
  deriveBalance,
  validateEntrySign,
} from '../src';

describe('ledger: sign rules', () => {
  it('purchase, tip received, payout refund are positive', () => {
    expect(LEDGER_SIGN.PURCHASE_CREDIT).toBe(1);
    expect(LEDGER_SIGN.TIP_RECEIVED).toBe(1);
    expect(LEDGER_SIGN.PAYOUT_REFUND).toBe(1);
  });

  it('tip sent and payout debit are negative', () => {
    expect(LEDGER_SIGN.TIP_SENT).toBe(-1);
    expect(LEDGER_SIGN.PAYOUT_DEBIT).toBe(-1);
  });

  it('validateEntrySign accepts properly-signed entries', () => {
    expect(() => validateEntrySign('PURCHASE_CREDIT', 80)).not.toThrow();
    expect(() => validateEntrySign('TIP_SENT', -10)).not.toThrow();
    expect(() => validateEntrySign('TIP_RECEIVED', 10)).not.toThrow();
    expect(() => validateEntrySign('PAYOUT_DEBIT', -300)).not.toThrow();
    expect(() => validateEntrySign('PAYOUT_REFUND', 300)).not.toThrow();
  });

  it('validateEntrySign accepts both signs for ADJUSTMENT', () => {
    expect(() => validateEntrySign('ADJUSTMENT', 5)).not.toThrow();
    expect(() => validateEntrySign('ADJUSTMENT', -5)).not.toThrow();
  });

  it('validateEntrySign rejects wrong-signed entries', () => {
    expect(() => validateEntrySign('PURCHASE_CREDIT', -80)).toThrow(TypeError);
    expect(() => validateEntrySign('TIP_SENT', 10)).toThrow(TypeError);
  });

  it('validateEntrySign rejects zero and non-integers', () => {
    expect(() => validateEntrySign('ADJUSTMENT', 0)).toThrow(TypeError);
    expect(() => validateEntrySign('ADJUSTMENT', 1.5)).toThrow(TypeError);
  });
});

describe('ledger: deriveBalance', () => {
  it('sums entries chronologically', () => {
    const entries = [
      { kind: 'PURCHASE_CREDIT', amount: 80 } as const,
      { kind: 'TIP_SENT', amount: -10 } as const,
      { kind: 'TIP_RECEIVED', amount: 5 } as const,
    ];
    expect(deriveBalance(entries)).toBe(75);
  });

  it('throws if balance ever goes negative', () => {
    const entries = [
      { kind: 'PURCHASE_CREDIT', amount: 5 } as const,
      { kind: 'TIP_SENT', amount: -10 } as const,
    ];
    expect(() => deriveBalance(entries)).toThrow(/negative/);
  });

  it('empty ledger has zero balance', () => {
    expect(deriveBalance([])).toBe(0);
  });
});

describe('ledger: buildTransferEntries', () => {
  it('produces paired debit/credit entries that sum to zero', () => {
    const t = buildTransferEntries('u_alice', 'u_bob', 25);
    expect(t.senderEntry.amount).toBe(-25);
    expect(t.receiverEntry.amount).toBe(25);
    expect(t.senderEntry.amount + t.receiverEntry.amount).toBe(0);
  });

  it('forbids self-tips (anti-fraud)', () => {
    expect(() => buildTransferEntries('u_alice', 'u_alice', 10)).toThrow(/SELF_TIP/);
  });

  it('rejects non-positive amounts', () => {
    expect(() => buildTransferEntries('a', 'b', 0)).toThrow(TypeError);
    expect(() => buildTransferEntries('a', 'b', -1)).toThrow(TypeError);
    expect(() => buildTransferEntries('a', 'b', 1.5)).toThrow(TypeError);
  });
});

describe('ledger: balance assertions', () => {
  it('throws InsufficientBalanceError when short', () => {
    expect(() => assertSufficientBalance(10, 20)).toThrow(InsufficientBalanceError);
  });

  it('passes when sufficient', () => {
    expect(() => assertSufficientBalance(20, 20)).not.toThrow();
    expect(() => assertSufficientBalance(30, 20)).not.toThrow();
  });

  it('error carries available and required', () => {
    try {
      assertSufficientBalance(10, 20);
    } catch (err) {
      expect((err as InsufficientBalanceError).available).toBe(10);
      expect((err as InsufficientBalanceError).required).toBe(20);
    }
  });
});

describe('ledger: balance reconciliation (acceptance: balance is always derivable)', () => {
  it('end-to-end: purchase 80, tip 25, receive 10 → balance 65', () => {
    const entries = [
      { kind: 'PURCHASE_CREDIT', amount: 80 } as const,
      { kind: 'TIP_SENT', amount: -25 } as const,
      { kind: 'TIP_RECEIVED', amount: 10 } as const,
    ];
    expect(deriveBalance(entries)).toBe(65);
  });
});
