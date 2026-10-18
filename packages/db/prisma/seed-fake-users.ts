import '@tiptalk/config'; // side-effect: load monorepo-root .env
import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

// Fake "seed" accounts to make the app look populated at launch. They use a
// recognizable email domain so they can be listed, excluded or deleted in one
// go (run `pnpm --filter @tiptalk/db seed:fake -- clean`).
const SEED_DOMAIN = 'tiptalk.seed';

// These seed profiles carry NO avatar (avatarUrl stays null) so they render as
// a plain initial and always sort behind real members with a real photo in the
// home discovery rail. Never use real people's photos without consent.

type Person = { name: string; g: 'f' | 'm'; locale: string };

// 100 fictional profiles: 38 women + 62 men, names from Latin-American Spanish,
// Portugal, Japan and Italy. `locale` matches the name's origin for realism.
const PEOPLE: Person[] = [
  // ─── Women (38) ───────────────────────────────────────────────────────
  // Latin America (14)
  { name: 'Valentina Rojas', g: 'f', locale: 'es' },
  { name: 'Camila Fernández', g: 'f', locale: 'es' },
  { name: 'Antonella Vega', g: 'f', locale: 'es' },
  { name: 'Isabella Morales', g: 'f', locale: 'es' },
  { name: 'Renata Castro', g: 'f', locale: 'es' },
  { name: 'Mariana Ríos', g: 'f', locale: 'es' },
  { name: 'Gabriela Mendoza', g: 'f', locale: 'es' },
  { name: 'Julieta Paredes', g: 'f', locale: 'es' },
  { name: 'Catalina Herrera', g: 'f', locale: 'es' },
  { name: 'Florencia Aguilar', g: 'f', locale: 'es' },
  { name: 'Micaela Sosa', g: 'f', locale: 'es' },
  { name: 'Agustina Ramírez', g: 'f', locale: 'es' },
  { name: 'Fernanda Delgado', g: 'f', locale: 'es' },
  { name: 'Carolina Navarro', g: 'f', locale: 'es' },
  // Portugal (8)
  { name: 'Matilde Oliveira', g: 'f', locale: 'pt' },
  { name: 'Beatriz Carvalho', g: 'f', locale: 'pt' },
  { name: 'Leonor Ferreira', g: 'f', locale: 'pt' },
  { name: 'Inês Sousa', g: 'f', locale: 'pt' },
  { name: 'Margarida Costa', g: 'f', locale: 'pt' },
  { name: 'Carlota Pereira', g: 'f', locale: 'pt' },
  { name: 'Madalena Rocha', g: 'f', locale: 'pt' },
  { name: 'Benedita Lopes', g: 'f', locale: 'pt' },
  // Japan (7)
  { name: 'Yui Tanaka', g: 'f', locale: 'ja' },
  { name: 'Sakura Yamamoto', g: 'f', locale: 'ja' },
  { name: 'Hana Sato', g: 'f', locale: 'ja' },
  { name: 'Rina Suzuki', g: 'f', locale: 'ja' },
  { name: 'Aoi Nakamura', g: 'f', locale: 'ja' },
  { name: 'Mei Kobayashi', g: 'f', locale: 'ja' },
  { name: 'Hinata Watanabe', g: 'f', locale: 'ja' },
  // Italy (9)
  { name: 'Giulia Romano', g: 'f', locale: 'it' },
  { name: 'Chiara Ricci', g: 'f', locale: 'it' },
  { name: 'Francesca Greco', g: 'f', locale: 'it' },
  { name: 'Sofia Conti', g: 'f', locale: 'it' },
  { name: 'Martina Bruno', g: 'f', locale: 'it' },
  { name: 'Alice Gallo', g: 'f', locale: 'it' },
  { name: 'Aurora Marino', g: 'f', locale: 'it' },
  { name: 'Beatrice Ferrari', g: 'f', locale: 'it' },
  { name: 'Elena Rizzo', g: 'f', locale: 'it' },

  // ─── Men (62) ─────────────────────────────────────────────────────────
  // Latin America (24)
  { name: 'Mateo Gómez', g: 'm', locale: 'es' },
  { name: 'Santiago Torres', g: 'm', locale: 'es' },
  { name: 'Benjamín Flores', g: 'm', locale: 'es' },
  { name: 'Thiago Vargas', g: 'm', locale: 'es' },
  { name: 'Lucas Ramírez', g: 'm', locale: 'es' },
  { name: 'Nicolás Medina', g: 'm', locale: 'es' },
  { name: 'Emiliano Cabrera', g: 'm', locale: 'es' },
  { name: 'Joaquín Guerrero', g: 'm', locale: 'es' },
  { name: 'Maximiliano Peña', g: 'm', locale: 'es' },
  { name: 'Diego Campos', g: 'm', locale: 'es' },
  { name: 'Tomás Silva', g: 'm', locale: 'es' },
  { name: 'Agustín Molina', g: 'm', locale: 'es' },
  { name: 'Facundo Ibáñez', g: 'm', locale: 'es' },
  { name: 'Bruno Cortés', g: 'm', locale: 'es' },
  { name: 'Gael Figueroa', g: 'm', locale: 'es' },
  { name: 'Sebastián Ortega', g: 'm', locale: 'es' },
  { name: 'Andrés Villalba', g: 'm', locale: 'es' },
  { name: 'Martín Acosta', g: 'm', locale: 'es' },
  { name: 'Felipe Suárez', g: 'm', locale: 'es' },
  { name: 'Cristóbal Reyes', g: 'm', locale: 'es' },
  { name: 'Ignacio Fuentes', g: 'm', locale: 'es' },
  { name: 'Rodrigo Carrasco', g: 'm', locale: 'es' },
  { name: 'Alejandro Bravo', g: 'm', locale: 'es' },
  { name: 'Dylan Espinoza', g: 'm', locale: 'es' },
  // Portugal (12)
  { name: 'João Fernandes', g: 'm', locale: 'pt' },
  { name: 'Francisco Almeida', g: 'm', locale: 'pt' },
  { name: 'Duarte Gonçalves', g: 'm', locale: 'pt' },
  { name: 'Tomás Marques', g: 'm', locale: 'pt' },
  { name: 'Afonso Ribeiro', g: 'm', locale: 'pt' },
  { name: 'Rodrigo Pinto', g: 'm', locale: 'pt' },
  { name: 'Gonçalo Teixeira', g: 'm', locale: 'pt' },
  { name: 'Martim Correia', g: 'm', locale: 'pt' },
  { name: 'Diogo Nunes', g: 'm', locale: 'pt' },
  { name: 'Tiago Monteiro', g: 'm', locale: 'pt' },
  { name: 'Rafael Cardoso', g: 'm', locale: 'pt' },
  { name: 'Guilherme Antunes', g: 'm', locale: 'pt' },
  // Japan (12)
  { name: 'Haruto Takahashi', g: 'm', locale: 'ja' },
  { name: 'Sota Ito', g: 'm', locale: 'ja' },
  { name: 'Yuto Watanabe', g: 'm', locale: 'ja' },
  { name: 'Riku Yamada', g: 'm', locale: 'ja' },
  { name: 'Ren Matsumoto', g: 'm', locale: 'ja' },
  { name: 'Kaito Inoue', g: 'm', locale: 'ja' },
  { name: 'Daiki Kimura', g: 'm', locale: 'ja' },
  { name: 'Sora Hayashi', g: 'm', locale: 'ja' },
  { name: 'Ryota Shimizu', g: 'm', locale: 'ja' },
  { name: 'Takumi Mori', g: 'm', locale: 'ja' },
  { name: 'Yuki Abe', g: 'm', locale: 'ja' },
  { name: 'Kenta Ikeda', g: 'm', locale: 'ja' },
  // Italy (14)
  { name: 'Lorenzo Russo', g: 'm', locale: 'it' },
  { name: 'Leonardo Esposito', g: 'm', locale: 'it' },
  { name: 'Francesco Romano', g: 'm', locale: 'it' },
  { name: 'Alessandro Colombo', g: 'm', locale: 'it' },
  { name: 'Matteo Ferraro', g: 'm', locale: 'it' },
  { name: 'Gabriele Marchetti', g: 'm', locale: 'it' },
  { name: 'Riccardo Barbieri', g: 'm', locale: 'it' },
  { name: 'Tommaso Fontana', g: 'm', locale: 'it' },
  { name: 'Edoardo Santoro', g: 'm', locale: 'it' },
  { name: 'Davide Mariani', g: 'm', locale: 'it' },
  { name: 'Andrea Longo', g: 'm', locale: 'it' },
  { name: 'Simone Martini', g: 'm', locale: 'it' },
  { name: 'Giuseppe Villa', g: 'm', locale: 'it' },
  { name: 'Antonio Serra', g: 'm', locale: 'it' },
];

function slugify(name: string, i: number): string {
  const base = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z]/g, '');
  return `${base}${(i + 1) * 7 + 3}`;
}

async function clean(): Promise<void> {
  const res = await prisma.user.deleteMany({
    where: { email: { endsWith: `@${SEED_DOMAIN}` } },
  });
  console.info(`[seed:fake] eliminados ${res.count} usuarios fake.`);
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
  for (let i = 0; i < PEOPLE.length; i += 1) {
    const { name, locale } = PEOPLE[i]!;
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
        avatarUrl: null, // no avatar on test accounts
        locale,
        // Exclude these accounts from onboarding nudge emails.
        avatarNudgeAt: now,
        galleryNudgeAt: now,
        wallet: { create: {} },
      },
      update: { displayName: name, avatarUrl: null, locale },
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
    const count = 3 + Math.floor(Math.random() * 10); // 3..12 followers
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

  const women = PEOPLE.filter((p) => p.g === 'f').length;
  const men = PEOPLE.length - women;
  console.info(
    `[seed:fake] ${created.length} usuarios creados (${women} chicas, ${men} chicos), ${follows} seguimientos.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
