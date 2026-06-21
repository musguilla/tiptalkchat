import { prisma, Prisma } from '@tiptalk/db';
import {
  type LedgerEntryLike,
  type LedgerKind,
  assertSufficientBalance,
  buildTransferEntries,
  deriveBalance,
  validateEntrySign,
} from '@tiptalk/economy';

export async function getOrCreateWallet(userId: string): Promise<{ id: string; balance: number }> {
  const w = await prisma.wallet.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });
  return { id: w.id, balance: w.balance };
}

export async function getOrCreateGuestWallet(
  guestId: string,
): Promise<{ id: string; balance: number }> {
  const w = await prisma.wallet.upsert({
    where: { guestId },
    create: { guestId },
    update: {},
  });
  return { id: w.id, balance: w.balance };
}

export interface AppendEntryInput {
  walletId: string;
  kind: LedgerKind;
  amount: number; // signed
  idempotencyKey: string;
  refType?: string;
  refId?: string;
  tx?: Prisma.TransactionClient;
}

/**
 * Append a ledger entry idempotently and update the cached wallet balance.
 * Caller is responsible for using a transaction when atomicity across multiple
 * entries is required (e.g. tip = sender debit + receiver credit).
 *
 * Uses optimistic locking via Wallet.version.
 */
export async function appendLedgerEntry(input: AppendEntryInput): Promise<{ balanceAfter: number }> {
  validateEntrySign(input.kind, input.amount);

  const client = input.tx ?? prisma;

  // Idempotency: if an entry with this key already exists, return its
  // post-balance unchanged.
  const existing = await client.ledgerEntry.findUnique({
    where: { idempotencyKey: input.idempotencyKey },
  });
  if (existing) return { balanceAfter: existing.balanceAfter };

  const wallet = await client.wallet.findUniqueOrThrow({ where: { id: input.walletId } });
  const newBalance = wallet.balance + input.amount;

  if (newBalance < 0) {
    assertSufficientBalance(wallet.balance, -input.amount);
  }

  const updated = await client.wallet.update({
    where: { id: wallet.id, version: wallet.version },
    data: { balance: newBalance, version: { increment: 1 } },
  });

  await client.ledgerEntry.create({
    data: {
      walletId: wallet.id,
      kind: input.kind,
      amount: input.amount,
      balanceAfter: updated.balance,
      idempotencyKey: input.idempotencyKey,
      refType: input.refType,
      refId: input.refId,
    },
  });

  return { balanceAfter: updated.balance };
}

export type TransferSender =
  | { kind: 'user'; userId: string }
  | { kind: 'guest'; guestId: string };

/**
 * Atomic transfer of `amount` Tipsys from sender to receiver. Both ledger
 * entries are written in a single DB transaction with optimistic locking,
 * so concurrent tips cannot produce a negative balance or a torn write.
 *
 * The sender can be a registered user OR a guest with an ephemeral wallet.
 * The receiver is always a registered user (only verified users can cash out).
 */
export async function transferTipsys(opts: {
  sender: TransferSender;
  receiverUserId: string;
  amount: number;
  refType: string;
  refId: string;
  idempotencyKey: string;
}): Promise<{ senderBalance: number; receiverBalance: number }> {
  const senderId = opts.sender.kind === 'user' ? opts.sender.userId : opts.sender.guestId;
  const transfer = buildTransferEntries(senderId, opts.receiverUserId, opts.amount);

  return prisma.$transaction(async (tx) => {
    const senderWallet =
      opts.sender.kind === 'user'
        ? await tx.wallet.upsert({
            where: { userId: opts.sender.userId },
            create: { userId: opts.sender.userId },
            update: {},
          })
        : await tx.wallet.upsert({
            where: { guestId: opts.sender.guestId },
            create: { guestId: opts.sender.guestId },
            update: {},
          });
    const receiverWallet = await tx.wallet.upsert({
      where: { userId: opts.receiverUserId },
      create: { userId: opts.receiverUserId },
      update: {},
    });

    const senderRes = await appendLedgerEntry({
      walletId: senderWallet.id,
      kind: transfer.senderEntry.kind,
      amount: transfer.senderEntry.amount,
      idempotencyKey: `${opts.idempotencyKey}:sender`,
      refType: opts.refType,
      refId: opts.refId,
      tx,
    });
    const receiverRes = await appendLedgerEntry({
      walletId: receiverWallet.id,
      kind: transfer.receiverEntry.kind,
      amount: transfer.receiverEntry.amount,
      idempotencyKey: `${opts.idempotencyKey}:receiver`,
      refType: opts.refType,
      refId: opts.refId,
      tx,
    });

    return { senderBalance: senderRes.balanceAfter, receiverBalance: receiverRes.balanceAfter };
  });
}

/** Recompute a wallet balance from its full ledger (used in tests and admin reconciliation). */
export async function reconcileWalletBalance(walletId: string): Promise<number> {
  const entries = await prisma.ledgerEntry.findMany({
    where: { walletId },
    orderBy: { createdAt: 'asc' },
    select: { kind: true, amount: true },
  });
  return deriveBalance(entries as LedgerEntryLike[]);
}
