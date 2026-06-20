'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { t } from '@/i18n';

export default function CreateRoomPage() {
  const router = useRouter();
  const token = useAuth((s) => s.token);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (typeof window !== 'undefined' && !token) {
    router.replace('/login');
    return null;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api<{ id: string; slug: string }>('/rooms', {
        method: 'POST',
        token: token!,
        body: JSON.stringify({
          name,
          ...(slug ? { slug } : {}),
          ...(pin ? { pin } : {}),
        }),
      });
      router.push(`/r/${res.slug}`);
    } catch {
      setError('No se pudo crear la sala');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-zinc-50 p-6 dark:bg-zinc-950">
      <form onSubmit={submit} className="w-full max-w-md space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-2xl font-bold">{t('es', 'landing.cta.create')}</h1>
        <label className="block space-y-1 text-sm">
          <span className="font-medium">{t('es', 'create.name')}</span>
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Fiesta de Marta" className="w-full rounded-md border border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-800" />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-medium">Slug (opcional)</span>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="fiesta-marta" className="w-full rounded-md border border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-800" />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-medium">PIN (opcional)</span>
          <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} className="w-full rounded-md border border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-800" />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="w-full rounded-md bg-brand-600 px-4 py-2 font-semibold text-white disabled:opacity-60">
          {loading ? '…' : t('es', 'create.submit')}
        </button>
      </form>
    </main>
  );
}
