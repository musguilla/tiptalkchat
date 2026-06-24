'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X as XIcon } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { PAYOUT_MIN_TIPSYS, formatTipsysAsEur, listPackages } from '@tiptalk/economy';
import { t } from '@/i18n';
import { Logo } from '@/components/Logo';

interface LedgerEntry {
  id: string;
  kind: string;
  amount: number;
  balanceAfter: number;
  createdAt: string;
  refType: string | null;
}

interface WalletState {
  balance: number;
  payoutMin: number;
  canRequestPayout: boolean;
}

export default function WalletPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [wallet, setWallet] = useState<WalletState | null>(null);
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    void Promise.all([
      api<WalletState>('/wallet', { token }),
      api<{ entries: LedgerEntry[] }>('/wallet/ledger', { token }),
    ]).then(([w, l]) => {
      setWallet(w);
      setEntries(l.entries);
    });
  }, [token]);

  async function buy(eurCents: number) {
    if (!token) return;
    setBusy(true);
    try {
      const res = await api<{ url: string }>('/purchases/checkout', {
        method: 'POST',
        token,
        body: JSON.stringify({ eurCents }),
      });
      window.location.href = res.url;
    } finally {
      setBusy(false);
    }
  }

  async function requestPayout() {
    if (!token || !wallet) return;
    setBusy(true);
    setMsg(null);
    try {
      await api('/payouts', {
        method: 'POST',
        token,
        body: JSON.stringify({ tipsys: PAYOUT_MIN_TIPSYS }),
      });
      setMsg(`✓ Solicitud de cobro de ${PAYOUT_MIN_TIPSYS} Tipsys enviada`);
    } catch (err) {
      setMsg('No se pudo solicitar el cobro. ¿Has completado el onboarding de Stripe Connect?');
    } finally {
      setBusy(false);
    }
  }

  async function connectStripe() {
    if (!token) return;
    setBusy(true);
    try {
      const res = await api<{ url: string }>('/connect/onboard', { method: 'POST', token });
      window.location.href = res.url;
    } finally {
      setBusy(false);
    }
  }

  if (!token) {
    return (
      <main className="grid min-h-screen place-items-center">
        <Link className="text-primary-500 underline" href="/login">Inicia sesión</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <header className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <Link href="/" className="flex items-center">
          <Logo className="text-xl" />
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/create" className="text-sm font-semibold text-primary-500 hover:underline">+ Crear sala</Link>
          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) router.back();
              else router.push('/');
            }}
            className="grid h-9 w-9 place-items-center rounded-md bg-surface-container text-ink-muted transition hover:bg-surface-high hover:text-ink"
            title="Volver"
            aria-label="Volver al chat"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
      </header>
      <h1 className="text-2xl font-bold">{t('es', 'wallet.title')}</h1>

      <section className="flex flex-col gap-3 rounded-xl border border-primary-200 bg-primary-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-sm font-bold text-primary-700">
            Activa los cobros de tus propinas
          </p>
          <p className="text-xs text-primary-700/80">
            Conecta una cuenta para retirar el dinero de tus Tipsys cuando quieras.
          </p>
        </div>
        <button
          onClick={connectStripe}
          disabled={busy}
          className="btn-tactile shrink-0 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-4 py-2 text-xs font-bold text-white shadow-soft hover:shadow-vivid disabled:opacity-60"
        >
          Activar cobros
        </button>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-gradient-to-br from-amber-50 to-amber-100 p-5 dark:border-zinc-800 dark:from-amber-900/30 dark:to-amber-700/20">
        <div className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300">
          {t('es', 'wallet.balance')}
        </div>
        <div className="mt-1 text-4xl font-black text-amber-900 dark:text-amber-100">
          {wallet?.balance ?? '…'} <span className="text-base font-medium opacity-70">Tipsys</span>
        </div>
        {wallet && wallet.balance >= PAYOUT_MIN_TIPSYS && (
          <div className="mt-1 text-sm text-amber-800 dark:text-amber-200">
            Canjeable hasta: {formatTipsysAsEur(wallet.balance - (wallet.balance % PAYOUT_MIN_TIPSYS))}
          </div>
        )}
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">{t('es', 'wallet.buy')}</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {listPackages().map((p) => (
            <button
              key={p.eurCents}
              onClick={() => buy(p.eurCents)}
              disabled={busy}
              className="rounded-lg border border-zinc-200 bg-white p-3 text-left transition hover:border-primary-500 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="text-xl font-bold">{p.tipsys}</div>
              <div className="text-xs text-zinc-500">Tipsys</div>
              <div className="mt-1 text-sm font-semibold text-primary-500">
                {(p.eurCents / 100).toFixed(2)} €
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">Cobro</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {t('es', 'wallet.payout.min', { min: PAYOUT_MIN_TIPSYS })} (=
          {' '}
          {formatTipsysAsEur(PAYOUT_MIN_TIPSYS)} bruto, antes de comisión)
        </p>
        <button
          onClick={requestPayout}
          disabled={busy || !wallet?.canRequestPayout}
          className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {t('es', 'wallet.payout.request')}
        </button>
        {msg && <p className="text-sm">{msg}</p>}
      </section>

      <section>
        <h2 className="mb-2 text-lg font-bold">Historial</h2>
        <ul className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
          {entries.length === 0 && (
            <li className="p-3 text-sm text-zinc-500">Sin movimientos todavía.</li>
          )}
          {entries.map((e) => (
            <li key={e.id} className="flex items-center justify-between p-3 text-sm">
              <div>
                <div className="font-medium">{kindLabel(e.kind)}</div>
                <div className="text-xs text-zinc-500">
                  {new Date(e.createdAt).toLocaleString('es-ES')}
                </div>
              </div>
              <div className={e.amount >= 0 ? 'font-bold text-emerald-600' : 'font-bold text-red-600'}>
                {e.amount > 0 ? '+' : ''}
                {e.amount} Tipsys
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function kindLabel(k: string): string {
  switch (k) {
    case 'PURCHASE_CREDIT':
      return 'Compra de Tipsys';
    case 'TIP_SENT':
      return 'Propina enviada';
    case 'TIP_RECEIVED':
      return 'Propina recibida';
    case 'PAYOUT_DEBIT':
      return 'Cobro solicitado';
    case 'PAYOUT_REFUND':
      return 'Devolución de cobro';
    default:
      return k;
  }
}
