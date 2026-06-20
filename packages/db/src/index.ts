import { PrismaClient, Prisma } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __tiptalk_prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  global.__tiptalk_prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') global.__tiptalk_prisma = prisma;

export { Prisma };
export type { PrismaClient };
