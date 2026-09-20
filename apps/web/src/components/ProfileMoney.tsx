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
import { AgeVerificationModal } from './AgeVerificationModal';
import { useT } from '@/i18n/useLocale';

type TFn = (key: string, vars?: Record<string, string | number>) => string;

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
  external_account: 'cmp.money.req.iban',
  'individual.verification.document': 'cmp.money.req.idPhoto',
  'individual.verification.additional_document': 'cmp.money.req.additionalDoc',
  'individual.id_number': 'cmp.money.req.idNumber',
  'individual.address.line1': 'cmp.money.req.address',
  'individual.address.city': 'cmp.money.req.city',
  'individual.address.postal_code': 'cmp.money.req.postalCode',
  'individual.dob.day': 'cmp.money.req.dob',
  'individual.dob.month': 'cmp.money.req.dob',
  'individual.dob.year': 'cmp.money.req.dob',
  'individual.first_name': 'cmp.money.req.firstName',
  'individual.last_name': 'cmp.money.req.lastName',
  'individual.email': 'cmp.money.req.email',
  'individual.phone': 'cmp.money.req.phone',
  'tos_acceptance.date': 'cmp.money.req.tos',
  'tos_acceptance.ip': 'cmp.money.req.tos',
};

function requirementLabels(codes: string[], t: TFn): string[] {
  return [...new Set(codes.map((c) => (REQUIREMENT_LABELS[c] ? t(REQUIREMENT_LABELS[c]) : c.replace(/[_.]/g, ' '))))];
}

function eurCents(cents: number): string {
  return `${(cents / 100).toFixed(2).replace('.', ',')} €`;
}

function ledgerLabel(kind: string, t: TFn): string {
  switch (kind) {
    case 'PURCHASE_CREDIT':
      return t('cmp.money.ledger.purchase');
    case 'TIP_SENT':
      return t('cmp.money.ledger.tipSent');
    case 'TIP_RECEIVED':
      return t('cmp.money.ledger.tipReceived');
    case 'PAYOUT_DEBIT':
      return t('cmp.money.ledger.payoutDebit');
    case 'PAYOUT_REFUND':
      return t('cmp.money.ledger.payoutRefund');
    case 'ADJUSTMENT':
      return t('cmp.money.ledger.adjustment');
    default:
      return kind;
  }
}

const PAYOUT_META: Record<string, { label: string; className: string }> = {
  requested: { label: 'cmp.money.payout.requested', className: 'bg-amber-100 text-amber-800' },
  in_review: { label: 'cmp.money.payout.inReview', className: 'bg-amber-100 text-amber-800' },
  paid: { label: 'cmp.money.payout.paid', className: 'bg-emerald-100 text-emerald-800' },
  failed: { label: 'cmp.money.payout.failed', className: 'bg-red-100 text-red-800' },
  refunded: { label: 'cmp.money.payout.refunded', className: 'bg-zinc-200 text-zinc-700' },
};

export function ProfileMoney({ token }: { token: string }) {
  const t = useT();
  const [data, setData] = useState<Overview | null>(null);
  const [setup, setSetup] = useState<PayoutSetupStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null);
  const [verifyOpen, setVerifyOpen] = useState(false);

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
        text: err instanceof Error ? err.message : t('cmp.money.loadFailed'),
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
      setMsg({ tone: 'ok', text: t('cmp.money.connectDone') });
      void load();
    } else if (p === 'refresh') {
      setMsg({ tone: 'error', text: t('cmp.money.connectRefresh') });
    }
  }, [load, t]);

  async function go(action: string, path: string): Promise<void> {
    setBusy(action);
    setMsg(null);
    try {
      const res = await api<{ url: string }>(path, { method: 'POST', token, body: '{}' });
      window.location.href = res.url;
    } catch (err) {
      setBusy(null);
      const text = err instanceof Error ? err.message : '';
      // The API gates monetization behind age verification. Open the flow
      // instead of surfacing a raw error.
      if (text.includes('AGE_VERIFICATION_REQUIRED')) {
        setVerifyOpen(true);
        return;
      }
      setMsg({ tone: 'error', text: text || t('cmp.money.openConfigFailed') });
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
      setMsg({ tone: 'error', text: err instanceof Error ? err.message : t('cmp.money.buyFailed') });
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
      setMsg({ tone: 'ok', text: t('cmp.money.payoutRequestedOk') });
      await load();
    } catch (err) {
      const apiMsg =
        err instanceof ApiError && err.payload && typeof err.payload === 'object'
          ? ((err.payload as { message?: string }).message ?? null)
          : null;
      setMsg({ tone: 'error', text: apiMsg ?? t('cmp.money.payoutFailed') });
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

  const pending = requirementLabels(setup?.pending ?? [], t);
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
          title={t('cmp.money.wallet')}
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
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">{t('cmp.money.balance')}</p>
                <p className="mt-1 font-display text-2xl font-extrabold tracking-tight text-ink">
                  {data.wallet.balance} Tipsys
                </p>
                <p className="text-sm text-ink-muted">{formatTipsysAsEur(data.wallet.balance)}</p>
              </div>

              <div className="rounded-lg bg-surface-soft p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">{t('cmp.money.payouts')}</p>
                <p className="mt-1.5">
                  {payoutsOn ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                      <BadgeCheck className="h-3 w-3" /> {t('cmp.money.active')}
                    </span>
                  ) : started ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                      <Clock className="h-3 w-3" /> {t('cmp.money.verificationPending')}
                    </span>
                  ) : (
                    <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-semibold text-zinc-700">
                      {t('cmp.money.notActivated')}
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
                          : t('cmp.money.needAtLeast', { min: data.wallet.payoutMin })
                      }
                      className="btn-tactile inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-soft hover:shadow-vivid disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {busy === 'payout' && <Loader2 className="h-3 w-3 animate-spin" />}
                      {t('cmp.money.requestPayout')}
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
                      {t('cmp.money.manage')}
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                      {started
                        ? t('cmp.money.needVerify')
                        : t('cmp.money.activateToWithdraw')}
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
                            {t('cmp.money.andMore', { count: pending.length - 3 })}
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
                      {started ? t('cmp.money.continue') : t('cmp.money.activatePayouts')}
                    </button>
                  </>
                )}
              </div>
            </div>

            <h4 className="mt-5 text-xs font-semibold uppercase tracking-wider text-ink-muted">
              {t('cmp.money.recentMovements')}
            </h4>
            {data.recentLedger.length === 0 ? (
              <p className="mt-2 text-sm text-ink-muted">{t('cmp.money.noMovements')}</p>
            ) : (
              <ul className="mt-2 divide-y divide-surface-container rounded-lg border border-surface-container">
                {data.recentLedger.slice(0, 8).map((e) => (
                  <li
                    key={e.id}
                    className="flex items-center justify-between gap-3 px-3 py-2 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-ink">{ledgerLabel(e.kind, t)}</p>
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
                      <p className="text-xs tabular-nums text-ink-soft">{t('cmp.money.balanceAfter', { balance: e.balanceAfter })}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </SectionCard>

        {/* ---- Tips + comprar ---- */}
        <SectionCard title={t('cmp.money.tips')} icon={<Coins className="h-4 w-4" />}>
          <div className="space-y-3">
            <div className="rounded-lg bg-surface-soft p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                {t('cmp.money.received')}
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
                {t('cmp.money.sent')}
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
                {t('cmp.money.buyTipsys')}
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
          title={t('cmp.money.payouts')}
          icon={<Banknote className="h-4 w-4" />}
          action={<span className="text-sm text-ink-muted">{t('cmp.money.requestCount', { count: data.payouts.length })}</span>}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[460px] text-sm">
              <thead>
                <tr className="border-b border-surface-container text-left text-xs uppercase tracking-wider text-ink-muted">
                  <th className="pb-2 font-semibold">{t('cmp.money.date')}</th>
                  <th className="pb-2 font-semibold">Tipsys</th>
                  <th className="pb-2 font-semibold">{t('cmp.money.net')}</th>
                  <th className="pb-2 font-semibold">{t('cmp.money.status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {data.payouts.map((p) => {
                  const metaDef = PAYOUT_META[p.status];
                  const meta = {
                    label: metaDef ? t(metaDef.label) : p.status,
                    className: metaDef?.className ?? 'bg-zinc-200 text-zinc-700',
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

      <AgeVerificationModal
        open={verifyOpen}
        onClose={() => setVerifyOpen(false)}
        token={token}
        onSubmitted={() => load()}
      />
    </section>
  );
}
