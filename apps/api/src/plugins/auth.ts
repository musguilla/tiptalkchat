import type { FastifyInstance, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

export type SessionActor =
  | { kind: 'user'; userId: string; role: string }
  | { kind: 'guest'; guestId: string; roomId: string };

declare module 'fastify' {
  interface FastifyInstance {
    /** Throws unless the request is authenticated as a real user. */
    requireUser: (req: FastifyRequest) => Promise<{ userId: string; role: string }>;
    /** Throws unless the request is authenticated as user OR guest. */
    requireActor: (req: FastifyRequest) => Promise<SessionActor>;
  }
  interface FastifyRequest {
    sessionUser: { userId: string; role: string } | null;
    sessionActor: SessionActor | null;
  }
}

interface UserJwt {
  sub: string;
  role: string;
  kind?: 'user';
}
interface GuestJwt {
  sub: string;
  kind: 'guest';
  roomId: string;
}

async function plugin(app: FastifyInstance): Promise<void> {
  app.decorateRequest('sessionUser', null);
  app.decorateRequest('sessionActor', null);

  app.addHook('onRequest', async (req) => {
    type Augmented = FastifyRequest & {
      sessionUser: { userId: string; role: string } | null;
      sessionActor: SessionActor | null;
    };
    const r = req as Augmented;
    r.sessionUser = null;
    r.sessionActor = null;

    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
    if (!token) return;
    try {
      const decoded = app.jwt.verify<UserJwt | GuestJwt>(token);
      if ('kind' in decoded && decoded.kind === 'guest') {
        r.sessionActor = { kind: 'guest', guestId: decoded.sub, roomId: decoded.roomId };
      } else {
        const user = decoded as UserJwt;
        r.sessionUser = { userId: user.sub, role: user.role };
        r.sessionActor = { kind: 'user', userId: user.sub, role: user.role };
      }
    } catch {
      /* invalid token — leave sessionActor=null */
    }
  });

  app.decorate('requireUser', async (req: FastifyRequest) => {
    type Augmented = FastifyRequest & {
      sessionUser: { userId: string; role: string } | null;
    };
    const u = (req as Augmented).sessionUser;
    if (!u) throw app.httpErrors.unauthorized('Authentication required');
    return u;
  });

  app.decorate('requireActor', async (req: FastifyRequest) => {
    type Augmented = FastifyRequest & { sessionActor: SessionActor | null };
    const a = (req as Augmented).sessionActor;
    if (!a) throw app.httpErrors.unauthorized('Authentication required');
    return a;
  });
}

export const authPlugin = fp(plugin, { name: 'tiptalk-auth' });
