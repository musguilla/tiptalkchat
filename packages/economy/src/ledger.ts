/**
 * Pure ledger functions. The persistent ledger is append-only and is the
 * canonical source of truth for any wallet's balance — `Wallet.balance` is a
 * cache that MUST be reconcilable from the ledger.
 */

export const LEDGER_KINDS = [
  'PURCHASE_CREDIT',
  'TIP_SENT',
  'TIP_RECEIVED',
  'PAYOUT_DEBIT',
  'PAYOUT_REFUND',
  'ADJUSTMENT',
] as const;

export type LedgerKind = (typeof LEDGER_KINDS)[number];

export interface LedgerEntryLike {
  kind: LedgerKind;
  /** Signed delta in Tipsys: positive credits, negative debits. */
  amount: number;
}

/** Sign rules per kind — used both at write time and during reconciliation. */
export const LEDGER_SIGN: Record<LedgerKind, 1 | -1> = {
  PURCHASE_CREDIT: 1,
  TIP_SENT: -1,
  TIP_RECEIVED: 1,
  PAYOUT_DEBIT: -1,
  PAYOUT_REFUND: 1,
  ADJUSTMENT: 1, // sign is encoded in the amount
};

/** Derive a wallet balance from a chronologically-ordered list of entries. */
export function deriveBalance(entries: readonly LedgerEntryLike[]): number {
  let balance = 0;
  for (const e of entries) {
    balance += e.amount;
    if (balance < 0) {
      throw new RangeError(
        `Ledger inconsistency: balance went negative at entry kind=${e.kind} amount=${e.amount}`,
      );
    }
  }
  return balance;
}

/**
 * Validate that a planned (kind, signedAmount) entry has the correct sign for
 * its kind and is non-zero (ADJUSTMENT may be any non-zero integer).
 */
export function validateEntrySign(kind: LedgerKind, amount: number): void {
  if (!Number.isInteger(amount) || amount === 0) {
    throw new TypeError(`amount must be a non-zero integer (got ${amount})`);
  }
  if (kind === 'ADJUSTMENT') return;
  const expectedSign = LEDGER_SIGN[kind];
  const actualSign = amount > 0 ? 1 : -1;
  if (expectedSign !== actualSign) {
    throw new TypeError(
      `kind=${kind} expects sign=${expectedSign} but amount=${amount} has sign=${actualSign}`,
    );
  }
}

export interface PlannedTransfer {
  senderEntry: LedgerEntryLike & { kind: 'TIP_SENT' };
  receiverEntry: LedgerEntryLike & { kind: 'TIP_RECEIVED' };
}

/**
 * Build the two paired entries for a tip transfer. Self-tips are forbidden at
 * the rule layer (anti-fraud requirement from the spec).
 */
export function buildTransferEntries(
  senderUserId: string,
  receiverUserId: string,
  amount: number,
): PlannedTransfer {
  if (senderUserId === receiverUserId) {
    throw new Error('SELF_TIP_FORBIDDEN');
  }
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new TypeError(`amount must be a positive integer (got ${amount})`);
  }
  return {
    senderEntry: { kind: 'TIP_SENT', amount: -amount },
    receiverEntry: { kind: 'TIP_RECEIVED', amount: amount },
  };
}

export class InsufficientBalanceError extends Error {
  readonly code = 'INSUFFICIENT_BALANCE';
  constructor(public available: number, public required: number) {
    super(`Insufficient balance: have ${available} Tipsys, need ${required}`);
  }
}

export function assertSufficientBalance(available: number, required: number): void {
  if (available < required) throw new InsufficientBalanceError(available, required);
}
