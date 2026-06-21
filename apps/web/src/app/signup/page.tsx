'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { t } from '@/i18n';
import { Logo } from '@/components/Logo';

export default function SignupPage() {
  const router = useRouter();
  const setSession = useAuth((s) => s.setSession);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api<{ token: string; user: { id: string; email: string; displayName: string; role: string } }>(
        '/auth/signup',
        { method: 'POST', body: JSON.stringify({ email, password, displayName }) },
      );
      setSession(res.token, res.user);
      router.push('/create');
    } catch {
      setError('Error al crear cuenta');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-orange-50 via-white to-pink-50 p-6 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-900">
      <div className="w-full max-w-sm space-y-6">
        <Link href="/" className="flex justify-center">
          <Logo className="text-3xl" />
        </Link>
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-2xl font-bold">{t('es', 'auth.signup')}</h1>
        <label className="block space-y-1 text-sm">
          <span className="font-medium">{t('es', 'auth.displayName')}</span>
          <input required value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full rounded-md border border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-800" />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-medium">{t('es', 'auth.email')}</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-800" />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-medium">{t('es', 'auth.password')}</span>
          <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-md border border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-800" />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="w-full rounded-md bg-brand-600 px-4 py-2 font-semibold text-white disabled:opacity-60">
          {loading ? '…' : t('es', 'auth.signup')}
        </button>
        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="font-semibold text-orange-600 hover:underline">
            {t('es', 'auth.login')}
          </Link>
        </p>
      </form>
      </div>
    </main>
  );
}
