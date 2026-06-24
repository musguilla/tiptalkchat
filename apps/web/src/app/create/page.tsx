'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Check, Copy, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { Logo } from '@/components/Logo';

interface CreatedRoom {
  id: string;
  slug: string;
  name: string;
  asGuest: boolean;
  guestToken?: string;
  displayName?: string;
}

export default function CreateRoomPage() {
  const router = useRouter();
  const token = useAuth((s) => s.token);

  const [nick, setNick] = useState('');
  const [name, setName] = useState('');
  const [created, setCreated] = useState<CreatedRoom | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api<CreatedRoom>('/rooms', {
        method: 'POST',
        token: token ?? undefined,
        body: JSON.stringify({
          name,
          ...(token ? {} : { nick }),
        }),
      });
      // For anonymous hosts, persist the host token keyed by slug so the
      // /r/[slug] page can authenticate them automatically next visit.
      if (res.asGuest && res.guestToken) {
        const tokens = readHostTokens();
        tokens[res.slug] = {
          token: res.guestToken,
          displayName: res.displayName ?? nick,
        };
        writeHostTokens(tokens);
      }
      setCreated(res);
    } catch {
      setError('No se pudo crear la sala. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  if (created) {
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/r/${created.slug}`;
    return (
      <main className="grid min-h-screen place-items-center bg-canvas p-6">
        <div className="w-full max-w-md space-y-6">
          <Link href="/" className="flex justify-center">
            <Logo className="text-3xl" />
          </Link>
          <div className="w-full space-y-6 rounded-lg border border-surface-container bg-white p-7 shadow-soft">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary-50 text-primary-500">
                <Check className="h-5 w-5" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-extrabold tracking-tight">
                  ¡Tu sala está lista!
                </h1>
                <p className="mt-1 text-sm text-ink-muted">
                  Comparte este enlace con quien quieras invitar.
                </p>
              </div>
            </div>

            <div>
              <label className="label-mono mb-2 block text-ink">Enlace de la sala</label>
              <div className="flex items-center gap-2 rounded-md border border-surface-container bg-surface-soft p-2">
                <span className="flex-1 truncate text-sm font-medium text-ink">{url}</span>
                <button
                  type="button"
                  onClick={() => {
                    void navigator.clipboard.writeText(url);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="btn-tactile flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-ink shadow-soft transition hover:bg-canvas"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-primary-500" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copiar
                    </>
                  )}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push(`/r/${created.slug}`)}
              className="btn-tactile flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-6 py-3.5 font-bold text-white shadow-vivid hover:shadow-vivid-strong"
            >
              Entra a tu sala <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="grid min-h-screen place-items-center bg-canvas p-6">
      <div className="w-full max-w-md space-y-6">
        <Link href="/" className="flex justify-center">
          <Logo className="text-3xl" />
        </Link>
        <form
          onSubmit={submit}
          className="w-full max-w-md space-y-5 rounded-lg border border-surface-container bg-white p-7 shadow-soft"
        >
          <h1 className="font-display text-2xl font-extrabold tracking-tight">Crear sala</h1>
          <p className="text-sm text-ink-muted">
            No necesitas cuenta. Solo pon tu nick y un nombre para la sala.
          </p>

          {!token && (
            <label className="block space-y-1.5 text-sm">
              <span className="font-medium text-ink">Tu nick</span>
              <input
                required
                maxLength={40}
                value={nick}
                onChange={(e) => setNick(e.target.value)}
                placeholder="¿Cómo te llamas?"
                className="w-full rounded-md border border-transparent bg-surface-soft p-2.5 outline-none transition focus:border-primary-500 focus:bg-white"
              />
            </label>
          )}

          <label className="block space-y-1.5 text-sm">
            <span className="font-medium text-ink">Nombre de la sala</span>
            <input
              required
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Fiesta de Marta"
              className="w-full rounded-md border border-transparent bg-surface-soft p-2.5 outline-none transition focus:border-primary-500 focus:bg-white"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            disabled={loading}
            className="btn-tactile w-full rounded-md bg-primary-500 px-4 py-2.5 font-semibold text-white shadow-soft hover:bg-primary-600 disabled:opacity-60"
          >
            {loading ? '…' : 'Crear sala'}
          </button>
        </form>
      </div>
    </main>
  );
}

// ---- Host token persistence (localStorage). ----
interface HostTokenEntry {
  token: string;
  displayName: string;
}
const HOST_TOKENS_KEY = 'tiptalk-host-tokens';

function readHostTokens(): Record<string, HostTokenEntry> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(HOST_TOKENS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, HostTokenEntry>) : {};
  } catch {
    return {};
  }
}
function writeHostTokens(tokens: Record<string, HostTokenEntry>): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(HOST_TOKENS_KEY, JSON.stringify(tokens));
  } catch {
    /* swallow */
  }
}
