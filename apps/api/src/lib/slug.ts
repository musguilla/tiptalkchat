import { customAlphabet } from 'nanoid';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';
const generateSuffix = customAlphabet(ALPHABET, 4);

const ADJECTIVES = [
  'azul', 'rojo', 'verde', 'oro', 'plata', 'feliz', 'rapido', 'sabio',
  'brillante', 'magico', 'fiesta', 'salsa', 'tango', 'cosmico', 'estrella',
];
const NOUNS = [
  'tigre', 'leon', 'puma', 'aguila', 'lobo', 'oso', 'zorro', 'gato',
  'sol', 'luna', 'mar', 'rio', 'monte', 'bosque', 'cielo',
];

function pick<T>(arr: readonly T[]): T {
  const i = Math.floor(Math.random() * arr.length);
  return arr[i] as T;
}

/** Produce a friendly slug like "fiesta-tigre-a7k2" with a random 4-char suffix. */
export function generateFriendlySlug(): string {
  return `${pick(ADJECTIVES)}-${pick(NOUNS)}-${generateSuffix()}`;
}

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function isValidCustomSlug(slug: string): boolean {
  return slug.length >= 3 && slug.length <= 40 && SLUG_RE.test(slug);
}

export function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}
