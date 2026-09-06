'use client';
import { useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  BadgeCheck,
  Banknote,
  Clock,
  Coins,
  ExternalLink,
  Loader2,
  Wallet,
} from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import { formatTipsysAsEur, listPackages } from '@tiptalk/economy';
import { SectionCard } from './SectionCard';

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

interface PayoutSetupStatus {
  connected: boolean;
  status: string | null;
  payoutsEnabled: boolean;
  detailsSubmitted?: boolean;
  pending?: string[];
}

/**
 * The payment provider's requirement codes are opaque; say what they actually
 * mean. Deliberately provider-agnostic wording — the user never needs to know
 * which processor is behind the payouts.
 */
const REQUIREMENT_LABELS: Record<string, string> = {
  external_account: 'Tu número de cuenta bancaria (IBAN)',
  'individual.verification.document': 'Una foto de tu DNI o pasaporte',
  'individual.verification.additional_document': 'Un documento adicional',
  'individual.id_number': 'Tu número de documento',
  'individual.address.line1': 'Tu dirección',
  'individual.address.city': 'Tu ciudad',
  'individual.address.postal_code': 'Tu código postal',
  'individual.dob.day': 'Tu fecha de nacimiento',
  'individual.dob.month': 'Tu fecha de nacimiento',
  'individual.dob.year': 'Tu fecha de nacimiento',
  'individual.first_name': 'Tu nombre',
  'individual.last_name': 'Tus apellidos',
  'individual.email': 'Tu email',
  'individual.phone': 'Tu teléfono',
  'tos_acceptance.date': 'Aceptar las condiciones de cobro',
  'tos_acceptance.ip': 'Aceptar las condiciones de cobro',
};

function requirementLabels(codes: string[]): string[] {
  return [...new Set(codes.map((c) => REQUIREMENT_LABELS[c] ?? c.replace(/[_.]/g, ' ')))];
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
  const [setup, setSetup] = useState<PayoutSetupStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null);

  const load = useCallback(async () => {
    try {
      const [overview, status] = await Promise.all([
        api<Overview>('/users/me/overview', { token }),
        api<PayoutSetupStatus>('/connect/status', { token }),
      ]);
      setData(overview);
      setSetup(status);
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

  // Coming back from the payout-setup flow: re-read the live status.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const p = new URLSearchParams(window.location.search).get('connect');
    if (p === 'done') {
      setMsg({ tone: 'ok', text: 'Hemos recibido tus datos. La verificación puede tardar unos minutos.' });
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
        text: err instanceof Error ? err.message : 'No se pudo abrir la configuración de cobros',
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
        <div className="h-56 animate-pulse rounded-xl bg-surface-container" />
      </section>
    );
  }
  if (!data) return null;

  const pending = requirementLabels(setup?.pending ?? []);
  const payoutsOn = setup?.payoutsEnabled ?? data.connect.payoutsEnabled;
  const started = setup?.connected ?? data.connect.connected;

  return (
    <section className="mt-4 space-y-4">
      {msg && (
        <p
          className={`rounded-md border px-4 py-2.5 text-sm ${
            msg.tone === 'ok'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {msg.text}
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        {/* ---- Monedero ---- */}
        <SectionCard
          title="Monedero"
          icon={<Wallet className="h-4 w-4" />}
          className="lg:col-span-2"
          action={
            <span className="text-sm text-ink-muted">
              {data.wallet.balance} Tipsys · {formatTipsysAsEur(data.wallet.balance)}
            </span>
          }
        >
          <div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-surface-soft p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Saldo</p>
                <p className="mt-1 font-display text-2xl font-extrabold tracking-tight text-ink">
                  {data.wallet.balance} Tipsys
                </p>
                <p className="text-sm text-ink-muted">{formatTipsysAsEur(data.wallet.balance)}</p>
              </div>

              <div className="rounded-lg bg-surface-soft p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Cobros</p>
                <p className="mt-1.5">
                  {payoutsOn ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                      <BadgeCheck className="h-3 w-3" /> Activos
                    </span>
                  ) : started ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                      <Clock className="h-3 w-3" /> Verificación pendiente
                    </span>
                  ) : (
                    <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-semibold text-zinc-700">
                      Sin activar
                    </span>
                  )}
                </p>

                {payoutsOn ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => void requestPayout()}
                      disabled={!data.wallet.canRequestPayout || busy !== null}
                      title={
                        data.wallet.canRequestPayout
                          ? undefined
                          : `Necesitas al menos ${data.wallet.payoutMin} Tipsys`
                      }
                      className="btn-tactile inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-soft hover:shadow-vivid disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {busy === 'payout' && <Loader2 className="h-3 w-3 animate-spin" />}
                      Solicitar cobro
                    </button>
                    <button
                      type="button"
                      onClick={() => void go('dashboard', '/connect/dashboard')}
                      disabled={busy !== null}
                      className="btn-tactile inline-flex items-center gap-1.5 rounded-full border border-surface-container bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:bg-surface-soft disabled:opacity-60"
                    >
                      {busy === 'dashboard' ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <ExternalLink className="h-3 w-3" />
                      )}
                      Gestionar
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                      {started
                        ? 'Falta verificar tus datos para poder retirar.'
                        : 'Actívalos para retirar a tu cuenta las propinas que recibas.'}
                    </p>
                    {pending.length > 0 && (
                      <ul className="mt-2 space-y-0.5">
                        {pending.slice(0, 3).map((label) => (
                          <li key={label} className="flex items-start gap-1.5 text-xs text-ink-muted">
                            <AlertCircle className="mt-0.5 h-3 w-3 shrink-0 text-amber-500" />
                            {label}
                          </li>
                        ))}
                        {pending.length > 3 && (
                          <li className="pl-4.5 text-xs text-ink-soft">
                            y {pending.length - 3} más
                          </li>
                        )}
                      </ul>
                    )}
                    <button
                      type="button"
                      onClick={() => void go('onboard', '/connect/onboard')}
                      disabled={busy !== null}
                      className="btn-tactile mt-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-soft hover:shadow-vivid disabled:opacity-60"
                    >
                      {busy === 'onboard' && <Loader2 className="h-3 w-3 animate-spin" />}
                      {started ? 'Continuar' : 'Activar cobros'}
                    </button>
                  </>
                )}
              </div>
            </div>

            <h4 className="mt-5 text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Últimos movimientos
            </h4>
            {data.recentLedger.length === 0 ? (
              <p className="mt-2 text-sm text-ink-muted">Sin movimientos todavía.</p>
            ) : (
              <ul className="mt-2 divide-y divide-surface-container rounded-lg border border-surface-container">
                {data.recentLedger.slice(0, 8).map((e) => (
                  <li
                    key={e.id}
                    className="flex items-center justify-between gap-3 px-3 py-2 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-ink">{ledgerLabel(e.kind)}</p>
                      <p className="text-xs text-ink-muted">
                        {new Date(e.createdAt).toLocaleString('es-ES')}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p
                        className={`font-bold tabular-nums ${
                          e.amount >= 0 ? 'text-emerald-600' : 'text-red-600'
                        }`}
                      >
                        {e.amount > 0 ? '+' : ''}
                        {e.amount} Tipsys
                      </p>
                      <p className="text-xs tabular-nums text-ink-soft">Saldo: {e.balanceAfter}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </SectionCard>

        {/* ---- Tips + comprar ---- */}
        <SectionCard title="Tips" icon={<Coins className="h-4 w-4" />}>
          <div className="space-y-3">
            <div className="rounded-lg bg-surface-soft p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Recibidos
              </p>
              <p className="mt-1 font-display text-2xl font-extrabold tracking-tight text-ink">
                {data.tips.received.count}
              </p>
              <p className="text-sm text-ink-muted">
                {data.tips.received.tipsys} Tipsys · {formatTipsysAsEur(data.tips.received.tipsys)}
              </p>
            </div>
            <div className="rounded-lg bg-surface-soft p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Enviados
              </p>
              <p className="mt-1 font-display text-2xl font-extrabold tracking-tight text-ink">
                {data.tips.sent.count}
              </p>
              <p className="text-sm text-ink-muted">
                {data.tips.sent.tipsys} Tipsys · {formatTipsysAsEur(data.tips.sent.tipsys)}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Comprar Tipsys
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {listPackages().map((p) => (
                  <button
                    key={p.eurCents}
                    type="button"
                    onClick={() => void buy(p.eurCents)}
                    disabled={busy !== null}
                    className="btn-tactile rounded-lg border border-surface-container bg-white px-2 py-2 text-center transition hover:border-primary-400 hover:shadow-soft disabled:opacity-60"
                  >
                    <span className="block font-display text-sm font-extrabold text-ink">
                      {p.tipsys}
                    </span>
                    <span className="block text-[11px] font-semibold text-primary-500">
                      {busy === `buy-${p.eurCents}` ? '…' : eurCents(p.eurCents)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* ---- Cobros (solo si los hay) ---- */}
      {data.payouts.length > 0 && (
        <SectionCard
          title="Cobros"
          icon={<Banknote className="h-4 w-4" />}
          action={<span className="text-sm text-ink-muted">{data.payouts.length} solicitud(es)</span>}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[460px] text-sm">
              <thead>
                <tr className="border-b border-surface-container text-left text-xs uppercase tracking-wider text-ink-muted">
                  <th className="pb-2 font-semibold">Fecha</th>
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
                      <td className="py-2 text-ink-muted">
                        {new Date(p.createdAt).toLocaleDateString('es-ES')}
                      </td>
                      <td className="py-2 font-medium tabular-nums text-ink">{p.tipsys}</td>
                      <td className="py-2 font-semibold tabular-nums text-ink">
                        {eurCents(p.netEurCents)}
                      </td>
                      <td className="py-2">
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
        </SectionCard>
      )}
    </section>
  );
}
