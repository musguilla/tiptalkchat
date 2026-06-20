import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '@tiptalk/db';
import { hashPassword, verifyPassword } from '../lib/passwords.js';
import { loadEnv } from '@tiptalk/config';

const signupBody = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  displayName: z.string().min(1).max(40),
  locale: z.enum(['es', 'en']).optional(),
});

const loginBody = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function authRoutes(app: FastifyInstance): Promise<void> {
  const env = loadEnv();

  app.post('/signup', async (req, reply) => {
    const body = signupBody.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) throw app.httpErrors.conflict('Email already registered');

    const user = await prisma.user.create({
      data: {
        email: body.email,
        passwordHash: await hashPassword(body.password),
        displayName: body.displayName,
        locale: body.locale ?? 'es',
        wallet: { create: {} },
      },
    });
    const token = app.jwt.sign({ sub: user.id, role: user.role }, { expiresIn: env.JWT_ACCESS_TTL });
    reply.code(201);
    return {
      token,
      user: { id: user.id, email: user.email, displayName: user.displayName, role: user.role },
    };
  });

  app.post('/login', async (req) => {
    const body = loginBody.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) throw app.httpErrors.unauthorized('Invalid credentials');
    const ok = await verifyPassword(user.passwordHash, body.password);
    if (!ok) throw app.httpErrors.unauthorized('Invalid credentials');
    const token = app.jwt.sign({ sub: user.id, role: user.role }, { expiresIn: env.JWT_ACCESS_TTL });
    return {
      token,
      user: { id: user.id, email: user.email, displayName: user.displayName, role: user.role },
    };
  });

  app.get('/me', async (req) => {
    const { userId } = await app.requireUser(req);
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        displayName: true,
        avatarUrl: true,
        role: true,
        kycStatus: true,
        wallet: { select: { balance: true } },
      },
    });
    return user;
  });
}
