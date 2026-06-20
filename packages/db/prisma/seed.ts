import { PrismaClient } from '@prisma/client';
import { createHash, randomBytes } from 'node:crypto';

const prisma = new PrismaClient();

function hashPassword(plain: string): string {
  // NOTE: this is a deterministic demo hash used only for seeding. The real
  // auth flow in apps/api uses argon2. Production seeds should use the same.
  const salt = 'demo-salt';
  return createHash('sha256').update(salt + plain).digest('hex');
}

async function main(): Promise<void> {
  console.info('Seeding demo data...');

  const alice = await prisma.user.upsert({
    where: { email: 'alice@tiptalk.demo' },
    create: {
      email: 'alice@tiptalk.demo',
      emailVerified: true,
      passwordHash: hashPassword('demo1234'),
      displayName: 'Alice',
      avatarUrl: 'https://api.dicebear.com/9.x/notionists/svg?seed=alice',
      wallet: { create: {} },
    },
    update: {},
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@tiptalk.demo' },
    create: {
      email: 'bob@tiptalk.demo',
      emailVerified: true,
      passwordHash: hashPassword('demo1234'),
      displayName: 'Bob',
      avatarUrl: 'https://api.dicebear.com/9.x/notionists/svg?seed=bob',
      wallet: { create: { balance: 80 } },
    },
    update: {},
  });

  // Seed an initial purchase for Bob (10€ → 80 Tipsys) into the ledger.
  const wallet = await prisma.wallet.findUnique({ where: { userId: bob.id } });
  if (wallet && wallet.balance === 80) {
    const existing = await prisma.ledgerEntry.findFirst({
      where: { walletId: wallet.id, kind: 'PURCHASE_CREDIT' },
    });
    if (!existing) {
      await prisma.ledgerEntry.create({
        data: {
          walletId: wallet.id,
          kind: 'PURCHASE_CREDIT',
          amount: 80,
          balanceAfter: 80,
          idempotencyKey: `seed-${randomBytes(8).toString('hex')}`,
          refType: 'purchase',
        },
      });
    }
  }

  const fiesta = await prisma.room.upsert({
    where: { slug: 'fiesta-demo' },
    create: {
      slug: 'fiesta-demo',
      name: 'Fiesta Demo',
      creatorId: alice.id,
      memberships: {
        create: [
          { userId: alice.id, role: 'creator' },
          { userId: bob.id, role: 'member' },
        ],
      },
    },
    update: {},
  });

  const existingMsgs = await prisma.message.count({ where: { roomId: fiesta.id } });
  if (existingMsgs === 0) {
    await prisma.message.createMany({
      data: [
        { roomId: fiesta.id, authorId: alice.id, kind: 'text', body: '¡Bienvenido a TipTalk!' },
        { roomId: fiesta.id, authorId: bob.id, kind: 'text', body: '¡Gracias por la invitación!' },
      ],
    });
  }

  console.info('Demo data ready:');
  console.info('  - alice@tiptalk.demo / demo1234  (creator)');
  console.info('  - bob@tiptalk.demo   / demo1234  (member, wallet=80 Tipsys)');
  console.info('  - Room: /r/fiesta-demo');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
