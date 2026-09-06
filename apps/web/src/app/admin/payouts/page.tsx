'use client';
import { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { Banknote, CheckCircle2, XCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { useAdminFetch } from '../_components/useAdminFetch';
import { useUrlState } from '../_components/useUrlState';
import { PageHeader } from '../_components/PageHeader';
import { Tabs, type TabItem } from '../_components/Tabs';
import { Avatar } from '../_components/Avatar';
import { Badge, PayoutStatusBadge } from '../_components/Badge';
import { InlineModal } from '../_components/InlineModal';
import { EmptyState, ErrorBanner, TableSkeleton } from '../_components/Feedback';
import { TableHead, TableShell, Td, Th, Tr } from '../_components/DataTable';
import { describeApiError, formatDate, formatEurCents, formatInt } from '../_components/format';
import type { AdminPayoutRow, AdminPayoutsResponse } from '../_components/types';

type PayoutTab = 'pending' | 'paid' | 'failed' | 'refunded' | 'all';

type PayoutModal =
  | { kind: 'approve'; payout: AdminPayoutRow }
  | { kind: 'reject'; payout: AdminPayoutRow };

const REASON_MAX = 500;

function readTab(raw: string | null): PayoutTab {
  return raw === 'paid' || raw === 'failed' || raw === 'refunded' || raw === 'all' ? raw : 'pending';
}

function isPending(p: AdminPayoutRow): boolean {
  return p.status === 'requested' || p.status === 'in_review';
}

function matchesTab(p: AdminPayoutRow, tab: PayoutTab): boolean {
  if (tab === 'all') return true;
  if (tab === 'pending') return isPending(p);
  return p.status === tab;
}

const INPUT_CLASSES =
  'w-full rounded-md border border-transparent bg-surface-soft p-2.5 text-sm text-ink outline-none transition focus:border-primary-500 focus:bg-white';

export default function AdminPayoutsPage() {
  return (
    <Suspense fallback={<PageHeader title="Payouts" />}>
      <PayoutsPageInner />
    </Suspense>
  );
}

function PayoutsPageInner() {
  const token = useAuth((s) => s.token);
  const { searchParams, set } = useUrlState();
  const tab = readTab(searchParams.get('tab'));

  // One request for everything, filtered client-side (the list is small and
  // "Pendientes" spans two API statuses).
  const { data, loading, refreshing, error, reload } =
    useAdminFetch<AdminPayoutsResponse>('/admin/payouts?status=all');

  const [modal, setModal] = useState<PayoutModal | null>(null);
  const [stripeId, setStripeId] = useState('');
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const all = useMemo(() => data?.payouts ?? [], [data]);
  const rows = useMemo(() => all.filter((p) => matchesTab(p, tab)), [all, tab]);

  const tabs: ReadonlyArray<TabItem<PayoutTab>> = [
    { key: 'pending', label: 'Pendientes', count: all.filter(isPending).length },
    { key: 'paid', label: 'Pagados', count: all.filter((p) => p.status === 'paid').length },
    { key: 'failed', label: 'Fallidos', count: all.filter((p) => p.status === 'failed').length },
    { key: 'refunded', label: 'Reembolsados', count: all.filter((p) => p.status === 'refunded').length },
    { key: 'all', label: 'Todos', count: all.length },
  ];

  function openModal(next: PayoutModal): void {
    setStripeId('');
    setReason('');
    setActionError(null);
    setModal(next);
  }

  function closeModal(): void {
    if (!busy) setModal(null);
  }

  async function runModal(): Promise<void> {
    if (!modal || !token) return;
    setBusy(true);
    setActionError(null);
    try {
      if (modal.kind === 'approve') {
        const id = stripeId.trim();
        await api<AdminPayoutRow>(`/admin/payouts/${modal.payout.id}/approve`, {
          method: 'POST',
          token,
          body: JSON.stringify(id ? { stripeTransferId: id } : {}),
        });
      } else {
        await api<AdminPayoutRow>(`/admin/payouts/${modal.payout.id}/reject`, {
          method: 'POST',
          token,
          body: JSON.stringify({ reason: reason.trim() }),
        });
      }
      setModal(null);
      reload();
    } catch (err) {
      setActionError(describeApiError(err));
      setModal(null);
    } finally {
      setBusy(false);
    }
  }

  const reasonTrimmed = reason.trim();
  const reasonValid = reasonTrimmed.length >= 1 && reasonTrimmed.length <= REASON_MAX;

  return (
    <div>
      <PageHeader
        title="Payouts"
        subtitle="Solicitudes de cobro de Tipsys. Aprobar marca el pago como hecho; rechazar devuelve los Tipsys al monedero."
        refreshing={refreshing}
      />

      <div className="mb-4">
        <Tabs items={tabs} value={tab} onChange={(key) => set({ tab: key === 'pending' ? null : key })} />
      </div>

      {error && <ErrorBanner message={error} onRetry={reload} className="mb-4" />}
      {actionError && <ErrorBanner message={actionError} className="mb-4" />}

      <div className="overflow-hidden rounded-xl border border-surface-container bg-white shadow-soft">
        {loading ? (
          <TableSkeleton rows={6} cols={7} />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={<Banknote className="h-6 w-6" />}
            title={
              tab === 'pending'
                ? 'No hay payouts pendientes'
                : tab === 'all'
                  ? 'Todavía no hay solicitudes de cobro'
                  : 'No hay payouts en este estado'
            }
            className="border-0"
          />
        ) : (
          <TableShell minWidth="min-w-[960px]">
            <TableHead>
              <Th>Usuario</Th>
              <Th align="right">Tipsys</Th>
              <Th align="right">Bruto</Th>
              <Th align="right">Comisión</Th>
              <Th align="right">Neto</Th>
              <Th>Connect</Th>
              <Th>Estado</Th>
              <Th>Solicitado</Th>
              <Th align="right">Acciones</Th>
            </TableHead>
            <tbody>
              {rows.map((p, i) => (
                <Tr key={p.id} index={i}>
                  <Td>
                    <Link
                      href={`/admin/usuarios/${p.userId}`}
                      className="flex max-w-[240px] items-center gap-3 hover:text-primary-600"
                    >
                      <Avatar url={p.user.avatarUrl} name={p.user.displayName} size="md" />
                      <span className="min-w-0">
                        <span className="block truncate font-semibold text-ink hover:underline">
                          {p.user.displayName}
                        </span>
                        <span className="block truncate text-xs text-ink-muted">{p.user.email}</span>
                      </span>
                    </Link>
                  </Td>
                  <Td align="right" className="tabular-nums">
                    {formatInt(p.tipsys)}
                  </Td>
                  <Td align="right" className="tabular-nums text-ink-muted">
                    {formatEurCents(p.grossEurCents)}
                  </Td>
                  <Td align="right" className="tabular-nums text-ink-muted">
                    -{formatEurCents(p.feeEurCents)}
                  </Td>
                  <Td align="right" className="font-semibold tabular-nums text-ink">
                    {formatEurCents(p.netEurCents)}
                  </Td>
                  <Td>
                    {p.connect ? (
                      p.connect.payoutsEnabled ? (
                        <Badge tone="success">
                          <CheckCircle2 className="h-3 w-3" />
                          Payouts OK
                        </Badge>
                      ) : (
                        <Badge tone="warning">
                          <XCircle className="h-3 w-3" />
                          Payouts desactivados
                        </Badge>
                      )
                    ) : (
                      <Badge tone="danger">
                        <XCircle className="h-3 w-3" />
                        Sin Connect
                      </Badge>
                    )}
                    {p.connect && (
                      <p
                        className="mt-1 max-w-[160px] truncate font-mono text-[10px] text-ink-soft"
                        title={p.connect.stripeAccountId}
                      >
                        {p.connect.stripeAccountId}
                      </p>
                    )}
                  </Td>
                  <Td>
                    <PayoutStatusBadge status={p.status} />
                    {p.status === 'paid' && (
                      <p className="mt-1 text-[11px] text-ink-muted">
                        Pagado el {formatDate(p.paidAt)}
                        {p.stripeTransferId && (
                          <>
                            <br />
                            <span className="font-mono" title={p.stripeTransferId}>
                              {p.stripeTransferId}
                            </span>
                          </>
                        )}
                      </p>
                    )}
                    {(p.status === 'refunded' || p.status === 'failed') && p.failureReason && (
                      <p className="mt-1 max-w-[220px] text-[11px] text-ink-muted" title={p.failureReason}>
                        {p.failureReason}
                      </p>
                    )}
                  </Td>
                  <Td className="whitespace-nowrap text-ink-muted">{formatDate(p.createdAt)}</Td>
                  <Td align="right">
                    {isPending(p) ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal({ kind: 'approve', payout: p });
                          }}
                          className="btn-tactile inline-flex items-center gap-1.5 rounded-md bg-primary-500 px-3 py-1.5 text-xs font-semibold text-white shadow-soft transition hover:bg-primary-600"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Aprobar
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal({ kind: 'reject', payout: p });
                          }}
                          className="btn-tactile inline-flex items-center gap-1.5 rounded-md bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          Rechazar
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-ink-soft">—</span>
                    )}
                  </Td>
                </Tr>
              ))}
            </tbody>
          </TableShell>
        )}
      </div>

      {/* Approve: optional Stripe transfer id */}
      <InlineModal
        open={modal?.kind === 'approve'}
        title="Aprobar payout"
        description={
          modal
            ? `Se marcará como pagado el cobro de ${modal.payout.user.displayName} por ${formatEurCents(modal.payout.netEurCents)} netos (${formatInt(modal.payout.tipsys)} Tipsys). Asegúrate de haber hecho la transferencia en Stripe.`
            : undefined
        }
        confirmLabel="Marcar como pagado"
        tone="primary"
        busy={busy}
        onConfirm={() => void runModal()}
        onCancel={closeModal}
      >
        <label className="block space-y-1.5 text-sm">
          <span className="font-medium text-ink">
            ID de transferencia de Stripe <span className="text-ink-soft">(opcional)</span>
          </span>
          <input
            value={stripeId}
            onChange={(e) => setStripeId(e.target.value)}
            placeholder="tr_…"
            autoFocus
            className={`${INPUT_CLASSES} font-mono`}
          />
        </label>
      </InlineModal>

      {/* Reject: required reason */}
      <InlineModal
        open={modal?.kind === 'reject'}
        title="Rechazar payout"
        description={
          modal
            ? `Se devolverán ${formatInt(modal.payout.tipsys)} Tipsys al monedero de ${modal.payout.user.displayName} y la solicitud quedará como reembolsada.`
            : undefined
        }
        confirmLabel="Rechazar y devolver"
        tone="danger"
        busy={busy}
        confirmDisabled={!reasonValid}
        onConfirm={() => void runModal()}
        onCancel={closeModal}
      >
        <label className="block space-y-1.5 text-sm">
          <span className="font-medium text-ink">
            Motivo <span className="text-red-500">*</span>
          </span>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            maxLength={REASON_MAX}
            required
            autoFocus
            placeholder="Explica por qué se rechaza (lo verá el usuario)."
            className={`${INPUT_CLASSES} resize-y`}
          />
          <span className="block text-right text-[11px] text-ink-soft">
            {reasonTrimmed.length} / {REASON_MAX}
          </span>
        </label>
      </InlineModal>
    </div>
  );
}
