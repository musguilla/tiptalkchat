'use client';
import { useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  Clock,
  ExternalLink,
  Loader2,
  Plus,
  Wallet,
} from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import { formatTipsysAsEur, listPackages } from '@tiptalk/economy';

interface Overview {
  wallet: { balance: number; payoutMin: number; canRequestPayout: boolean };
  connect: {
    connected: boolean;
    status: string | null;
    payoutsEnabled: boolean;
    connectedAt: string | null;
  };
  payouts: Array<{
    id: string;
    tipsys: number;
    grossEurCents: number;
    feeEurCents: number;
    netEurCents: number;
    status: string;
    failureReason: string | null;
    createdAt: string;
    paidAt: string | null;
  }>;
  recentLedger: Array<{
    id: string;
    kind: string;
    amount: number;
    balanceAfter: number;
    createdAt: string;
  }>;
  tips: {
    received: { count: number; tipsys: number };
    sent: { count: number; tipsys: number };
  };
}

interface ConnectStatus {
  connected: boolean;
  status: string | null;
  payoutsEnabled: boolean;
  detailsSubmitted?: boolean;
  pending?: string[];
}

/** Stripe's requirement codes are opaque; say what they actually mean. */
const REQUIREMENT_LABELS: Record<string, string> = {
  external_account: 'Tu número de cuenta bancaria (IBAN)',
  'individual.verification.document': 'Una foto de tu DNI o pasaporte',
  'individual.verification.additional_document': 'Un documento adicional de verificación',
  'individual.id_number': 'Tu número de documento de identidad',
  'individual.address.line1': 'Tu dirección',
  'individual.dob.day': 'Tu fecha de nacimiento',
  'individual.first_name': 'Tu nombre legal',
  'individual.last_name': 'Tus apellidos',
  'individual.email': 'Tu email',
  'individual.phone': 'Tu teléfono',
};

function requirementLabel(code: string): string {
  return REQUIREMENT_LABELS[code] ?? code.replace(/_/g, ' ').replace(/\./g, ' › ');
}

function eurCents(cents: number): string {
  return `${(cents / 100).toFixed(2).replace('.', ',')} €`;
}

function ledgerLabel(kind: string): string {
  switch (kind) {
    case 'PURCHASE_CREDIT':
      return 'Compra de Tipsys';
    case 'TIP_SENT':
      return 'Propina enviada';
    case 'TIP_RECEIVED':
      return 'Propina recibida';
    case 'PAYOUT_DEBIT':
      return 'Cobro solicitado';
    case 'PAYOUT_REFUND':
      return 'Cobro devuelto';
    case 'ADJUSTMENT':
      return 'Ajuste';
    default:
      return kind;
  }
}

const PAYOUT_META: Record<string, { label: string; className: string }> = {
  requested: { label: 'Solicitado', className: 'bg-amber-100 text-amber-800' },
  in_review: { label: 'En revisión', className: 'bg-amber-100 text-amber-800' },
  paid: { label: 'Pagado', className: 'bg-emerald-100 text-emerald-800' },
  failed: { label: 'Fallido', className: 'bg-red-100 text-red-800' },
  refunded: { label: 'Devuelto', className: 'bg-zinc-200 text-zinc-700' },
};

export function ProfileMoney({ token }: { token: string }) {
  const [data, setData] = useState<Overview | null>(null);
  const [connect, setConnect] = useState<ConnectStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null);

  const load = useCallback(async () => {
    try {
      const [overview, status] = await Promise.all([
        api<Overview>('/users/me/overview', { token }),
        api<ConnectStatus>('/connect/status', { token }),
      ]);
      setData(overview);
      setConnect(status);
    } catch (err) {
      setMsg({
        tone: 'error',
        text: err instanceof Error ? err.message : 'No se pudieron cargar tus datos',
      });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  // Coming back from Stripe onboarding: re-read the live status.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const p = new URLSearchParams(window.location.search).get('connect');
    if (p === 'done') {
      setMsg({ tone: 'ok', text: 'Hemos recibido tus datos. Stripe puede tardar unos minutos en verificarlos.' });
      void load();
    } else if (p === 'refresh') {
      setMsg({ tone: 'error', text: 'El proceso se interrumpió. Puedes retomarlo cuando quieras.' });
    }
  }, [load]);

  async function go(action: string, path: string): Promise<void> {
    setBusy(action);
    setMsg(null);
    try {
      const res = await api<{ url: string }>(path, { method: 'POST', token, body: '{}' });
      window.location.href = res.url;
    } catch (err) {
      setBusy(null);
      setMsg({
        tone: 'error',
        text: err instanceof Error ? err.message : 'No se pudo abrir Stripe',
      });
    }
  }

  async function buy(amountEurCents: number): Promise<void> {
    setBusy(`buy-${amountEurCents}`);
    setMsg(null);
    try {
      const res = await api<{ url: string }>('/purchases/checkout', {
        method: 'POST',
        token,
        body: JSON.stringify({ eurCents: amountEurCents }),
      });
      window.location.href = res.url;
    } catch (err) {
      setBusy(null);
      setMsg({ tone: 'error', text: err instanceof Error ? err.message : 'No se pudo iniciar la compra' });
    }
  }

  async function requestPayout(): Promise<void> {
    if (!data) return;
    setBusy('payout');
    setMsg(null);
    try {
      await api('/payouts', {
        method: 'POST',
        token,
        body: JSON.stringify({ tipsys: data.wallet.payoutMin }),
      });
      setMsg({ tone: 'ok', text: 'Cobro solicitado. Lo revisamos y te llega a tu cuenta.' });
      await load();
    } catch (err) {
      const apiMsg =
        err instanceof ApiError && err.payload && typeof err.payload === 'object'
          ? ((err.payload as { message?: string }).message ?? null)
          : null;
      setMsg({ tone: 'error', text: apiMsg ?? 'No se pudo solicitar el cobro' });
    } finally {
      setBusy(null);
    }
  }

  if (loading) {
    return (
      <section className="mt-10">
        <div className="h-40 animate-pulse rounded-xl bg-surface-container" />
      </section>
    );
  }
  if (!data) return null;

  const pending = connect?.pending ?? [];
  const payoutsOn = connect?.payoutsEnabled ?? data.connect.payoutsEnabled;
  const isConnected = connect?.connected ?? data.connect.connected;

  return (
    <section className="mt-10 space-y-5">
      <h2 className="font-display text-2xl font-extrabold tracking-tight">Tu monedero</h2>

      {msg && (
        <p
          className={`rounded-md border px-4 py-3 text-sm ${
            msg.tone === 'ok'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {msg.text}
        </p>
      )}

      {/* Balance + tips */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 p-5">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700">
            <Wallet className="h-3.5 w-3.5" /> Saldo
          </p>
          <p className="mt-1 font-display text-3xl font-black text-amber-900">
            {data.wallet.balance}
            <span className="ml-1 text-base font-medium opacity-70">Tipsys</span>
          </p>
          <p className="text-sm text-amber-800">{formatTipsysAsEur(data.wallet.balance)}</p>
        </div>
        <div className="rounded-xl border border-surface-container bg-white p-5">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-muted">
            <ArrowDownLeft className="h-3.5 w-3.5 text-emerald-600" /> Recibido
          </p>
          <p className="mt-1 font-display text-3xl font-black text-ink">{data.tips.received.tipsys}</p>
          <p className="text-sm text-ink-muted">
            {formatTipsysAsEur(data.tips.received.tipsys)} · {data.tips.received.count} propina(s)
          </p>
        </div>
        <div className="rounded-xl border border-surface-container bg-white p-5">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-muted">
            <ArrowUpRight className="h-3.5 w-3.5 text-primary-500" /> Enviado
          </p>
          <p className="mt-1 font-display text-3xl font-black text-ink">{data.tips.sent.tipsys}</p>
          <p className="text-sm text-ink-muted">
            {formatTipsysAsEur(data.tips.sent.tipsys)} · {data.tips.sent.count} propina(s)
          </p>
        </div>
      </div>

      {/* Cobros / Connect */}
      <div className="rounded-xl border border-surface-container bg-white p-5 shadow-soft">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
              <Banknote className="h-5 w-5 text-primary-500" />
              Cobros
              {payoutsOn ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                  <BadgeCheck className="h-3 w-3" /> Activos
                </span>
              ) : isConnected ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                  <Clock className="h-3 w-3" /> Verificación pendiente
                </span>
              ) : (
                <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-semibold text-zinc-700">
                  Sin activar
                </span>
              )}
            </h3>
            <p className="mt-1 max-w-lg text-sm text-ink-muted">
              {payoutsOn
                ? `Ya puedes retirar tus Tipsys. Mínimo ${data.wallet.payoutMin} Tipsys (${formatTipsysAsEur(data.wallet.payoutMin)}).`
                : isConnected
                  ? 'Estamos esperando a que se verifiquen tus datos. Solo hace falta lo obligatorio por ley: tu nombre, tu documento y tu cuenta bancaria.'
                  : 'Activa los cobros para poder retirar a tu cuenta las propinas que recibas. Te pediremos solo lo obligatorio: nombre, documento e IBAN.'}
            </p>
            {!payoutsOn && pending.length > 0 && (
              <ul className="mt-3 space-y-1 text-sm text-ink-muted">
                {pending.slice(0, 5).map((code) => (
                  <li key={code} className="flex items-center gap-2">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                    {requirementLabel(code)}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            {payoutsOn ? (
              <>
                <button
                  type="button"
                  onClick={() => void requestPayout()}
                  disabled={!data.wallet.canRequestPayout || busy !== null}
                  title={
                    data.wallet.canRequestPayout
                      ? undefined
                      : `Necesitas al menos ${data.wallet.payoutMin} Tipsys`
                  }
                  className="btn-tactile inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-5 py-2.5 text-sm font-bold text-white shadow-vivid hover:shadow-vivid-strong disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {busy === 'payout' && <Loader2 className="h-4 w-4 animate-spin" />}
                  Solicitar cobro
                </button>
                <button
                  type="button"
                  onClick={() => void go('dashboard', '/connect/dashboard')}
                  disabled={busy !== null}
                  className="btn-tactile inline-flex items-center gap-2 rounded-full border border-surface-container bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-surface-soft disabled:opacity-60"
                >
                  {busy === 'dashboard' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ExternalLink className="h-4 w-4" />
                  )}
                  Gestionar cuenta
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => void go('onboard', '/connect/onboard')}
                disabled={busy !== null}
                className="btn-tactile inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-5 py-2.5 text-sm font-bold text-white shadow-vivid hover:shadow-vivid-strong disabled:opacity-60"
              >
                {busy === 'onboard' && <Loader2 className="h-4 w-4 animate-spin" />}
                {isConnected ? 'Continuar verificación' : 'Activar cobros'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Comprar Tipsys */}
      <div className="rounded-xl border border-surface-container bg-white p-5 shadow-soft">
        <h3 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
          <Plus className="h-5 w-5 text-primary-500" /> Comprar Tipsys
        </h3>
        <p className="mt-1 text-sm text-ink-muted">
          Para enviar propinas a otras personas. 1 € son 8 Tipsys.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {listPackages().map((p) => (
            <button
              key={p.eurCents}
              type="button"
              onClick={() => void buy(p.eurCents)}
              disabled={busy !== null}
              className="btn-tactile rounded-lg border border-surface-container bg-white p-3 text-left transition hover:border-primary-400 hover:shadow-soft disabled:opacity-60"
            >
              <div className="font-display text-xl font-extrabold text-ink">{p.tipsys}</div>
              <div className="text-xs text-ink-muted">Tipsys</div>
              <div className="mt-1 text-sm font-semibold text-primary-500">
                {busy === `buy-${p.eurCents}` ? '…' : eurCents(p.eurCents)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Payouts */}
      {data.payouts.length > 0 && (
        <div className="rounded-xl border border-surface-container bg-white p-5 shadow-soft">
          <h3 className="font-display text-lg font-bold text-ink">Tus cobros</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-surface-container text-left text-xs uppercase tracking-wider text-ink-muted">
                  <th className="pb-2 font-semibold">Solicitado</th>
                  <th className="pb-2 font-semibold">Tipsys</th>
                  <th className="pb-2 font-semibold">Neto</th>
                  <th className="pb-2 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {data.payouts.map((p) => {
                  const meta = PAYOUT_META[p.status] ?? {
                    label: p.status,
                    className: 'bg-zinc-200 text-zinc-700',
                  };
                  return (
                    <tr key={p.id}>
                      <td className="py-2.5 text-ink-muted">
                        {new Date(p.createdAt).toLocaleDateString('es-ES')}
                      </td>
                      <td className="py-2.5 font-medium text-ink">{p.tipsys}</td>
                      <td className="py-2.5 font-semibold text-ink">{eurCents(p.netEurCents)}</td>
                      <td className="py-2.5">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${meta.className}`}
                        >
                          {meta.label}
                        </span>
                        {p.failureReason && (
                          <span className="ml-2 text-xs text-ink-muted">{p.failureReason}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Movimientos */}
      {data.recentLedger.length > 0 && (
        <div className="rounded-xl border border-surface-container bg-white p-5 shadow-soft">
          <h3 className="font-display text-lg font-bold text-ink">Últimos movimientos</h3>
          <ul className="mt-3 divide-y divide-surface-container">
            {data.recentLedger.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink">{ledgerLabel(e.kind)}</p>
                  <p className="text-xs text-ink-muted">
                    {new Date(e.createdAt).toLocaleString('es-ES')}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p
                    className={`font-bold ${e.amount >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
                  >
                    {e.amount > 0 ? '+' : ''}
                    {e.amount} Tipsys
                  </p>
                  <p className="text-xs text-ink-soft">Saldo: {e.balanceAfter}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
