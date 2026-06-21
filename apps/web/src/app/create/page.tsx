'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { t } from '@/i18n';
import { Logo } from '@/components/Logo';

export default function CreateRoomPage() {
  const router = useRouter();
  const token = useAuth((s) => s.token);
  const [name, setName] = useState('');
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
    <main className="grid min-h-screen place-items-center bg-canvas p-6">
      <div className="w-full max-w-md space-y-6">
        <Link href="/" className="flex justify-center">
          <Logo className="text-3xl" />
        </Link>
      <form onSubmit={submit} className="w-full max-w-md space-y-5 rounded-lg border border-surface-container bg-white p-7 shadow-soft">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">{t('es', 'landing.cta.create')}</h1>
        <label className="block space-y-1.5 text-sm">
          <span className="font-medium text-ink">{t('es', 'create.name')}</span>
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Fiesta de Marta" className="w-full rounded-md border border-transparent bg-surface-soft p-2.5 outline-none transition focus:border-primary-500 focus:bg-white" />
        </label>
        <label className="block space-y-1.5 text-sm">
          <span className="font-medium text-ink">PIN (opcional)</span>
          <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} className="w-full rounded-md border border-transparent bg-surface-soft p-2.5 outline-none transition focus:border-primary-500 focus:bg-white" />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="btn-tactile w-full rounded-md bg-primary-500 px-4 py-2.5 font-semibold text-white shadow-soft hover:bg-primary-600 disabled:opacity-60">
          {loading ? '…' : t('es', 'create.submit')}
        </button>
      </form>
      </div>
    </main>
  );
}
