import type { FastifyInstance, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

export interface SessionUser {
  userId: string;
  role: string;
}

declare module 'fastify' {
  interface FastifyInstance {
    requireUser: (req: FastifyRequest) => Promise<SessionUser>;
  }
  interface FastifyRequest {
    sessionUser: SessionUser | null;
  }
}

async function plugin(app: FastifyInstance): Promise<void> {
  app.decorateRequest('sessionUser', null);

  app.addHook('onRequest', async (req) => {
    (req as FastifyRequest & { sessionUser: SessionUser | null }).sessionUser = null;
    try {
      const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
      if (!token) return;
      const decoded = app.jwt.verify<{ sub: string; role: string }>(token);
      (req as FastifyRequest & { sessionUser: SessionUser | null }).sessionUser = {
        userId: decoded.sub,
        role: decoded.role,
      };
    } catch {
      // keep as null
    }
  });

  app.decorate('requireUser', async (req: FastifyRequest) => {
    const u = (req as FastifyRequest & { sessionUser: SessionUser | null }).sessionUser;
    if (!u) throw app.httpErrors.unauthorized('Authentication required');
    return u;
  });
}

export const authPlugin = fp(plugin, { name: 'tiptalk-auth' });
