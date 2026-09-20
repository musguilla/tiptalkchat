'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { useT } from '@/i18n/useLocale';
import { Logo } from '@/components/Logo';

export default function SignupPage() {
  const t = useT();
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
      setError(t('pg.signup.error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-canvas p-6">
      <div className="w-full max-w-sm space-y-6">
        <Link href="/" className="flex justify-center">
          <Logo className="text-3xl" />
        </Link>
      <form onSubmit={submit} className="w-full max-w-sm space-y-5 rounded-lg border border-surface-container bg-white p-7 shadow-soft">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">{t('auth.signup')}</h1>
        <label className="block space-y-1.5 text-sm">
          <span className="font-medium text-ink">{t('auth.displayName')}</span>
          <input required value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full rounded-md border border-transparent bg-surface-soft p-2.5 outline-none transition focus:border-primary-500 focus:bg-white" />
        </label>
        <label className="block space-y-1.5 text-sm">
          <span className="font-medium text-ink">{t('auth.email')}</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-transparent bg-surface-soft p-2.5 outline-none transition focus:border-primary-500 focus:bg-white" />
        </label>
        <label className="block space-y-1.5 text-sm">
          <span className="font-medium text-ink">{t('auth.password')}</span>
          <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-md border border-transparent bg-surface-soft p-2.5 outline-none transition focus:border-primary-500 focus:bg-white" />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="btn-tactile w-full rounded-md bg-primary-500 px-4 py-2.5 font-semibold text-white shadow-soft hover:bg-primary-600 disabled:opacity-60">
          {loading ? '…' : t('auth.signup')}
        </button>
        <p className="text-center text-sm text-ink-muted">
          {t('pg.signup.haveAccount')}{' '}
          <Link href="/login" className="font-semibold text-primary-500 hover:underline">
            {t('auth.login')}
          </Link>
        </p>
      </form>
      </div>
    </main>
  );
}
