import { createServer } from 'node:http';
import { Server, type Socket } from 'socket.io';
import { loadEnv } from '@tiptalk/config';
import jwt from 'jsonwebtoken';
import type {
  ClientToServerEvents,
  Identity,
  ServerToClientEvents,
} from './events.js';

const env = loadEnv();
const PORT = Number(process.env.PORT ?? 4001);

interface SocketData {
  userId: string | null;
  identity: Identity | null;
  rooms: Set<string>;
  inCalls: Set<string>;
}

/**
 * Internal broadcast endpoint: lets the API push events into a room without
 * depending on a client socket being healthy. Auth is shared via the JWT
 * access secret (the API and realtime are co-deployed and trust each other).
 */
const http = createServer((req, res) => {
  if (req.url === '/internal/broadcast' && req.method === 'POST') {
    const auth = req.headers.authorization;
    if (auth !== `Bearer ${env.JWT_ACCESS_SECRET}`) {
      res.statusCode = 401;
      res.end();
      return;
    }
    let body = '';
    req.on('data', (chunk: Buffer) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body) as {
          event: string;
          roomId: string;
          payload: unknown;
        };
        if (!parsed.event || !parsed.roomId) {
          res.statusCode = 400;
          res.end('missing event or roomId');
          return;
        }
        io.to(roomKey(parsed.roomId)).emit(
          parsed.event as keyof ServerToClientEvents,
          parsed.payload as never,
        );
        res.statusCode = 204;
        res.end();
      } catch {
        res.statusCode = 400;
        res.end('invalid JSON');
      }
    });
    return;
  }
  if (req.url === '/health' || req.url === '/') {
    res.statusCode = 200;
    res.end('ok');
    return;
  }
  // Socket.IO handles its own /socket.io paths via the `attached` listener
  // added by the Server constructor — fall through silently for those.
});
const io = new Server<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>(
  http,
  {
    cors: { origin: [env.WEB_URL], credentials: true },
    path: '/socket.io',
  },
);

io.use((socket, next) => {
  const data = socket.data;
  data.rooms = new Set();
  data.inCalls = new Set();
  data.userId = null;
  data.identity = null;

  const token = socket.handshake.auth?.token as string | undefined;
  if (!token) {
    // allow anonymous (guest) connection — identity will be supplied at join
    return next();
  }
  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as { sub: string };
    data.userId = decoded.sub;
    next();
  } catch {
    next();
  }
});

io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>) => {
  socket.on('room:join', ({ roomId, identity }) => {
    if (!roomId) return;
    socket.data.identity = identity;
    socket.data.rooms.add(roomId);
    socket.join(roomKey(roomId));
    io.to(roomKey(roomId)).emit('presence:update', {
      roomId,
      member: identity,
      online: true,
    });
    // Send current room roster to the joiner
    sendRosterTo(socket, roomId).catch((err) => socket.emit('error', { code: 'ROSTER', message: String(err) }));
  });

  socket.on('room:leave', ({ roomId }) => {
    leaveRoom(socket, roomId);
  });

  socket.on('message:send', (payload, ack) => {
    if (!socket.data.rooms.has(payload.roomId)) {
      ack?.(false);
      return;
    }
    io.to(roomKey(payload.roomId)).emit('message:new', payload);
    ack?.(true);
  });

  socket.on('typing:start', ({ roomId }) => {
    if (!socket.data.identity) return;
    socket.to(roomKey(roomId)).emit('typing:update', {
      roomId,
      userId: socket.data.identity.id,
      typing: true,
    });
  });

  socket.on('typing:stop', ({ roomId }) => {
    if (!socket.data.identity) return;
    socket.to(roomKey(roomId)).emit('typing:update', {
      roomId,
      userId: socket.data.identity.id,
      typing: false,
    });
  });

  socket.on('tip:broadcast', (payload) => {
    io.to(roomKey(payload.targetType === 'room' ? payload.targetId : socket.data.rooms.values().next().value ?? '')).emit('tip:new', payload);
  });

  socket.on('call:join', ({ roomId }) => {
    if (!socket.data.identity) return;
    const callKey = callRoomKey(roomId);
    socket.data.inCalls.add(roomId);
    socket.join(callKey);
    socket.to(callKey).emit('call:peer-joined', {
      socketId: socket.id,
      identity: socket.data.identity,
    });
  });

  socket.on('call:leave', ({ roomId }) => {
    leaveCall(socket, roomId);
  });

  socket.on('call:signal', (signal) => {
    io.to(signal.toSocketId).emit('call:signal', signal);
  });

  socket.on('disconnect', () => {
    for (const roomId of socket.data.rooms) {
      if (socket.data.identity) {
        io.to(roomKey(roomId)).emit('presence:update', {
          roomId,
          member: socket.data.identity,
          online: false,
        });
      }
    }
    for (const callRoom of socket.data.inCalls) {
      io.to(callRoomKey(callRoom)).emit('call:peer-left', { socketId: socket.id });
    }
  });
});

function roomKey(roomId: string): string {
  return `room:${roomId}`;
}
function callRoomKey(roomId: string): string {
  return `call:${roomId}`;
}

function leaveRoom(
  socket: Socket<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>,
  roomId: string,
): void {
  socket.data.rooms.delete(roomId);
  socket.leave(roomKey(roomId));
  if (socket.data.identity) {
    io.to(roomKey(roomId)).emit('presence:update', {
      roomId,
      member: socket.data.identity,
      online: false,
    });
  }
}

function leaveCall(
  socket: Socket<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>,
  roomId: string,
): void {
  socket.data.inCalls.delete(roomId);
  socket.leave(callRoomKey(roomId));
  io.to(callRoomKey(roomId)).emit('call:peer-left', { socketId: socket.id });
}

async function sendRosterTo(
  socket: Socket<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>,
  roomId: string,
): Promise<void> {
  const sockets = await io.in(roomKey(roomId)).fetchSockets();
  const members: Identity[] = [];
  for (const s of sockets) {
    const id = (s.data as SocketData).identity;
    if (id) members.push(id);
  }
  socket.emit('room:state', { roomId, members });
}

http.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.info(`[realtime] listening on :${PORT}`);
});
