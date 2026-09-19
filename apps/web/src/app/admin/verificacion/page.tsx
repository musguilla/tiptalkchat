'use client';
import { useCallback, useEffect, useState } from 'react';
import { BadgeCheck, Loader2, ShieldCheck, X as XIcon, Check, Ban, Clock } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { useAdminFetch } from '../_components/useAdminFetch';
import { PageHeader } from '../_components/PageHeader';
import { Tabs, type TabItem } from '../_components/Tabs';
import { Avatar } from '../_components/Avatar';
import { Badge } from '../_components/Badge';
import { CardSkeleton, EmptyState, ErrorBanner } from '../_components/Feedback';
import { formatDate, describeApiError } from '../_components/format';

type Filter = 'pending' | 'all';

interface VUser {
  id: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  ageStatus?: string;
}
interface VRow {
  id: string;
  status: string;
  submittedAt: string;
  reviewedAt: string | null;
  rejectionReason: string | null;
  user: VUser;
}
interface VDetail {
  id: string;
  status: string;
  declaredAdult: boolean;
  submittedAt: string;
  user: VUser;
  documentUrl: string | null;
  selfieUrl: string | null;
}

const TABS: ReadonlyArray<TabItem<Filter>> = [
  { key: 'pending', label: 'Pendientes' },
  { key: 'all', label: 'Todas' },
];

function StatusBadge({ status }: { status: string }) {
  if (status === 'approved') return <Badge tone="success">Aprobada</Badge>;
  if (status === 'rejected') return <Badge tone="danger">Rechazada</Badge>;
  return <Badge tone="warning">Pendiente</Badge>;
}

export default function AdminVerificationPage() {
  const [filter, setFilter] = useState<Filter>('pending');
  const { data, loading, refreshing, error, reload } = useAdminFetch<{ verifications: VRow[] }>(
    `/admin/verifications?status=${filter}`,
  );
  const [openId, setOpenId] = useState<string | null>(null);

  const rows = data?.verifications ?? [];

  return (
    <div>
      <PageHeader
        title="Verificación de edad"
        subtitle="Revisa la documentación de los usuarios que quieren monetizar. Solo tú ves estos documentos."
        refreshing={refreshing}
      />

      <div className="mb-4">
        <Tabs items={TABS} value={filter} onChange={setFilter} />
      </div>

      {error && <ErrorBanner message={error} onRetry={reload} className="mb-4" />}

      {loading ? (
        <CardSkeleton count={4} />
      ) : rows.length === 0 ? (
        <EmptyState
          icon={<BadgeCheck className="h-6 w-6" />}
          title={filter === 'pending' ? 'No hay verificaciones pendientes' : 'Sin verificaciones'}
          hint="Cuando un usuario envíe su documentación para monetizar, aparecerá aquí."
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {rows.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => setOpenId(r.id)}
                className="flex w-full items-center gap-3 rounded-xl border border-surface-container bg-white p-4 text-left shadow-soft transition hover:border-primary-300 hover:shadow-vivid"
              >
                <Avatar url={r.user.avatarUrl} name={r.user.displayName} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink">{r.user.displayName}</p>
                  <p className="truncate text-xs text-ink-muted">{r.user.email}</p>
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-ink-soft">
                    <Clock className="h-3 w-3" /> {formatDate(r.submittedAt)}
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {openId && (
        <ReviewModal
          id={openId}
          onClose={() => setOpenId(null)}
          onReviewed={() => {
            setOpenId(null);
            reload();
          }}
        />
      )}
    </div>
  );
}

function ReviewModal({
  id,
  onClose,
  onReviewed,
}: {
  id: string;
  onClose: () => void;
  onReviewed: () => void;
}) {
  const token = useAuth((s) => s.token);
  const [detail, setDetail] = useState<VDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<'approve' | 'reject' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');

  const load = useCallback(() => {
    if (!token) return;
    setLoading(true);
    api<VDetail>(`/admin/verifications/${id}`, { token })
      .then(setDetail)
      .catch((e) => setError(describeApiError(e)))
      .finally(() => setLoading(false));
  }, [id, token]);

  useEffect(() => {
    load();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [load, onClose]);

  async function act(kind: 'approve' | 'reject'): Promise<void> {
    if (!token) return;
    setBusy(kind);
    setError(null);
    try {
      await api(`/admin/verifications/${id}/${kind}`, {
        method: 'POST',
        token,
        body: kind === 'reject' ? JSON.stringify({ reason }) : '{}',
      });
      onReviewed();
    } catch (e) {
      setError(describeApiError(e));
      setBusy(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-vivid-strong"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-surface-container px-5 py-4">
          <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-ink">
            <ShieldCheck className="h-5 w-5 text-primary-500" /> Revisar verificación
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-md text-ink-muted transition hover:bg-surface-soft"
            aria-label="Cerrar"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="grid place-items-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-ink-soft" />
            </div>
          ) : detail ? (
            <>
              <div className="mb-4 flex items-center gap-3">
                <Avatar url={detail.user.avatarUrl} name={detail.user.displayName} size="md" />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">{detail.user.displayName}</p>
                  <p className="truncate text-xs text-ink-muted">{detail.user.email}</p>
                </div>
                <div className="ml-auto">
                  <StatusBadge status={detail.status} />
                </div>
              </div>

              <p className="mb-3 text-xs text-ink-muted">
                Declaración 18+: {detail.declaredAdult ? '✅ aceptada' : '—'} · Enviada{' '}
                {formatDate(detail.submittedAt)}
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <DocView label="Documento de identidad" url={detail.documentUrl} />
                <DocView label="Selfie con documento" url={detail.selfieUrl} />
              </div>

              {error && (
                <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}

              {detail.status === 'pending' && (
                <div className="mt-5">
                  {rejecting && (
                    <input
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Motivo del rechazo (se muestra al usuario)"
                      className="mb-3 w-full rounded-lg border border-surface-container bg-surface-soft/40 px-3 py-2 text-sm outline-none focus:border-primary-300"
                    />
                  )}
                  <div className="flex items-center justify-end gap-2">
                    {!rejecting ? (
                      <button
                        type="button"
                        onClick={() => setRejecting(true)}
                        className="btn-tactile inline-flex items-center gap-1.5 rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100"
                      >
                        <Ban className="h-4 w-4" /> Rechazar
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => void act('reject')}
                        disabled={busy !== null}
                        className="btn-tactile inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60"
                      >
                        {busy === 'reject' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
                        Confirmar rechazo
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => void act('approve')}
                      disabled={busy !== null}
                      className="btn-tactile inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-5 py-2 text-sm font-bold text-white shadow-soft hover:shadow-vivid disabled:opacity-60"
                    >
                      {busy === 'approve' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      Aprobar
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="py-10 text-center text-sm text-ink-muted">No se pudo cargar.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function DocView({ label, url }: { label: string; url: string | null }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-ink-muted">{label}</p>
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-xl border border-surface-container">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={label} className="h-48 w-full bg-surface-soft object-contain" />
        </a>
      ) : (
        <div className="grid h-48 place-items-center rounded-xl border border-dashed border-surface-container bg-surface-soft/40 text-xs text-ink-soft">
          No aportado
        </div>
      )}
    </div>
  );
}
