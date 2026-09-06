import '@tiptalk/config'; // side-effect: load monorepo-root .env
import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

/**
 * Create-or-promote an admin user.
 *
 *   pnpm --filter @tiptalk/db admin:promote -- <email> [password]
 *
 * If the user exists: sets role=admin (and resets the password only when one
 * is passed). If not: creates the user with the given password and a wallet.
 * The user must log in again afterwards — role is baked into the JWT.
 */
const prisma = new PrismaClient();

async function main(): Promise<void> {
  const [email, password] = process.argv.slice(2).filter((a) => a !== "--");
  if (!email) {
    console.error('usage: admin:promote -- <email> [password]');
    process.exit(1);
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const data: { role: string; passwordHash?: string; blockedAt: null } = {
      role: 'admin',
      blockedAt: null,
    };
    if (password) data.passwordHash = await argon2.hash(password, { type: argon2.argon2id });
    await prisma.user.update({ where: { id: existing.id }, data });
    console.info(`promoted existing user ${email} → admin${password ? ' (password reset)' : ''}`);
    return;
  }
  if (!password) {
    console.error('user does not exist; a password is required to create it');
    process.exit(1);
  }
  const user = await prisma.user.create({
    data: {
      email,
      emailVerified: true,
      passwordHash: await argon2.hash(password, { type: argon2.argon2id }),
      displayName: email.split('@')[0] ?? 'Admin',
      role: 'admin',
      wallet: { create: {} },
    },
  });
  console.info(`created admin user ${email} (${user.id})`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
