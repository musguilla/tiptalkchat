import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { AccessToken } from 'livekit-server-sdk';
import { prisma } from '@tiptalk/db';
import { loadEnv } from '@tiptalk/config';

const tokenBody = z.object({
  roomId: z.string(),
});

export async function callTokenRoutes(app: FastifyInstance): Promise<void> {
  const env = loadEnv();

  app.get('/config', async () => ({
    provider: env.SFU_PROVIDER,
    livekitUrl: env.SFU_PROVIDER === 'livekit' ? env.LIVEKIT_URL ?? null : null,
    iceServers:
      env.SFU_PROVIDER === 'p2p'
        ? [
            { urls: env.STUN_URL },
            ...(env.TURN_URL
              ? [
                  {
                    urls: env.TURN_URL,
                    username: env.TURN_USERNAME,
                    credential: env.TURN_CREDENTIAL,
                  },
                ]
              : []),
          ]
        : [],
  }));

  app.post('/token', async (req) => {
    const actor = await app.requireActor(req);
    const body = tokenBody.parse(req.body);

    if (env.SFU_PROVIDER !== 'livekit') {
      throw app.httpErrors.badRequest('SFU_PROVIDER is not livekit; use P2P signaling on realtime');
    }
    if (!env.LIVEKIT_API_KEY || !env.LIVEKIT_API_SECRET || !env.LIVEKIT_URL) {
      throw app.httpErrors.internalServerError('LiveKit credentials missing');
    }

    const room = await prisma.room.findUniqueOrThrow({ where: { id: body.roomId } });

    let identity: string;
    let displayName: string;
    if (actor.kind === 'user') {
      const u = await prisma.user.findUniqueOrThrow({
        where: { id: actor.userId },
        select: { id: true, displayName: true },
      });
      identity = u.id;
      displayName = u.displayName;
    } else {
      if (actor.roomId !== room.id) {
        throw app.httpErrors.forbidden('Guest token does not match room');
      }
      const g = await prisma.guestSession.findUniqueOrThrow({
        where: { id: actor.guestId },
        select: { id: true, displayName: true },
      });
      identity = `guest:${g.id}`;
      displayName = g.displayName;
    }

    await prisma.callSession.upsert({
      where: { id: room.id },
      create: { id: room.id, roomId: room.id, sfuMode: 'livekit' },
      update: { sfuMode: 'livekit', endedAt: null },
    });

    const at = new AccessToken(env.LIVEKIT_API_KEY, env.LIVEKIT_API_SECRET, {
      identity,
      name: displayName,
      ttl: 60 * 60,
    });
    at.addGrant({
      roomJoin: true,
      room: `tiptalk:${room.slug}`,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });
    const token = await at.toJwt();

    return {
      token,
      url: env.LIVEKIT_URL,
      roomName: `tiptalk:${room.slug}`,
      identity,
    };
  });
}
