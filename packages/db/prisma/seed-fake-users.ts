import '@tiptalk/config'; // side-effect: load monorepo-root .env
import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

// Fake "seed" accounts to make the app look populated at launch. They use a
// recognizable email domain so they can be listed, excluded or deleted in one
// go (run `pnpm --filter @tiptalk/db seed:fake -- clean`).
const SEED_DOMAIN = 'tiptalk.seed';

// Illustrated avatars by default (DiceBear) — no real person's likeness.
// Replace the avatarUrl values with your own licensed / AI-generated photos to
// make them look realistic. Never use real people's photos without consent.
function avatarFor(seed: string): string {
  return `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(seed)}`;
}

const NAMES = [
  'Sofía', 'Lucía', 'Martina', 'Valeria', 'Carla', 'Nerea', 'Aitana',
  'Claudia', 'Noa', 'Alba', 'Jimena', 'Vega', 'Irene', 'Paula', 'Candela',
  'Daniela', 'Marta', 'Elena',
];

function slugify(name: string, i: number): string {
  const base = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z]/g, '');
  return `${base}${(i + 1) * 7 + 3}`; // e.g. sofia10
}

async function clean(): Promise<void> {
  const res = await prisma.user.deleteMany({
    where: { email: { endsWith: `@${SEED_DOMAIN}` } },
  });
  console.info(`[seed:fake] eliminadas ${res.count} usuarias fake.`);
}

async function main(): Promise<void> {
  if (process.argv.slice(2).includes('clean')) {
    await clean();
    return;
  }

  const passwordHash = await argon2.hash(
    `seed-${Math.random().toString(36).slice(2)}`,
    { type: argon2.argon2id },
  );

  const created: { id: string }[] = [];
  for (let i = 0; i < NAMES.length; i += 1) {
    const name = NAMES[i]!;
    const handle = slugify(name, i);
    const email = `${handle}@${SEED_DOMAIN}`;
    const now = new Date();
    const user = await prisma.user.upsert({
      where: { email },
      create: {
        email,
        emailVerified: true,
        passwordHash,
        displayName: name,
        avatarUrl: avatarFor(handle),
        // Exclude these accounts from onboarding nudge emails.
        avatarNudgeAt: now,
        galleryNudgeAt: now,
        wallet: { create: {} },
      },
      update: { displayName: name, avatarUrl: avatarFor(handle) },
      select: { id: true },
    });
    created.push(user);
  }

  // Seed cross-follows so follower/following counts look organic. Each user is
  // followed by a random subset of the others.
  let follows = 0;
  for (const target of created) {
    const others = created.filter((u) => u.id !== target.id);
    // shuffle
    for (let i = others.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [others[i], others[j]] = [others[j]!, others[i]!];
    }
    const count = 2 + Math.floor(Math.random() * 7); // 2..8 followers
    for (const follower of others.slice(0, count)) {
      try {
        await prisma.follow.create({
          data: { followerId: follower.id, followingId: target.id },
        });
        follows += 1;
      } catch {
        /* unique pair already exists */
      }
    }
  }

  console.info(`[seed:fake] ${created.length} usuarias creadas, ${follows} seguimientos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
