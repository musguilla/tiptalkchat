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
    const { userId } = await app.requireUser(req);
    const body = tokenBody.parse(req.body);

    if (env.SFU_PROVIDER !== 'livekit') {
      throw app.httpErrors.badRequest('SFU_PROVIDER is not livekit; use P2P signaling on realtime');
    }
    if (!env.LIVEKIT_API_KEY || !env.LIVEKIT_API_SECRET || !env.LIVEKIT_URL) {
      throw app.httpErrors.internalServerError('LiveKit credentials missing');
    }

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { id: true, displayName: true },
    });
    const room = await prisma.room.findUniqueOrThrow({ where: { id: body.roomId } });

    // Persist a CallSession marker so the schema reflects mode in use.
    await prisma.callSession.upsert({
      where: { id: room.id }, // 1 CallSession per room for simplicity
      create: { id: room.id, roomId: room.id, sfuMode: 'livekit' },
      update: { sfuMode: 'livekit', endedAt: null },
    });

    const at = new AccessToken(env.LIVEKIT_API_KEY, env.LIVEKIT_API_SECRET, {
      identity: user.id,
      name: user.displayName,
      ttl: 60 * 60, // 1h
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
      identity: user.id,
    };
  });
}
