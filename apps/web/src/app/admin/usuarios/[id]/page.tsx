'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Ban,
  Banknote,
  CheckCircle2,
  Coins,
  DoorClosed,
  ExternalLink,
  Eye,
  Image as ImageIcon,
  Lock,
  MessagesSquare,
  ShieldOff,
  Wallet,
  XCircle,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useAdminFetch } from '../../_components/useAdminFetch';
import { PageHeader } from '../../_components/PageHeader';
import { SectionCard } from '../../_components/SectionCard';
import { Avatar } from '../../_components/Avatar';
import { Badge, PayoutStatusBadge } from '../../_components/Badge';
import { OnlineDot } from '../../_components/OnlineDot';
import { RolePill } from '../../_components/RolePill';
import { EmptyState, ErrorBanner } from '../../_components/Feedback';
import { TableHead, TableShell, Td, Th, Tr } from '../../_components/DataTable';
import {
  describeApiError,
  formatDate,
  formatDateShort,
  formatEurCents,
  formatInt,
  formatTipsys,
  ledgerKindLabel,
  tipsysToEur,
} from '../../_components/format';
import type {
  AdminUserDetail,
  AdminUserRoom,
  BlockResponse,
  CloseRoomResponse,
  RoleResponse,
  UserRole,
} from '../../_components/types';

type PendingAction =
  | { kind: 'block' }
  | { kind: 'unblock' }
  | { kind: 'closeRoom'; room: AdminUserRoom };

const ROLE_OPTIONS: ReadonlyArray<{ value: UserRole; label: string }> = [
  { value: 'user', label: 'Usuario' },
  { value: 'mod', label: 'Mod' },
  { value: 'admin', label: 'Admin' },
];

function isRole(value: string): value is UserRole {
  return value === 'user' || value === 'mod' || value === 'admin';
}

export default function AdminUserDetailPage() {
  const params = useParams<{ id: string }>();
  const token = useAuth((s) => s.token);
  const meId = useAuth((s) => s.user?.id);
  const isSelf = meId === params.id;

  const { data, loading, refreshing, error, reload } = useAdminFetch<AdminUserDetail>(
    params.id ? `/admin/users/${params.id}` : null,
  );

  const [pending, setPending] = useState<PendingAction | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [roleBusy, setRoleBusy] = useState(false);

  async function runPending(): Promise<void> {
    if (!pending || !token || !data) return;
    setBusy(true);
    setActionError(null);
    try {
      if (pending.kind === 'closeRoom') {
        await api<CloseRoomResponse>(`/admin/rooms/${pending.room.id}/close`, {
          method: 'POST',
          token,
        });
      } else {
        await api<BlockResponse>(`/admin/users/${data.user.id}/${pending.kind}`, {
          method: 'POST',
          token,
        });
      }
      setPending(null);
      reload();
    } catch (err) {
      setActionError(describeApiError(err));
      setPending(null);
    } finally {
      setBusy(false);
    }
  }

  async function changeRole(role: UserRole): Promise<void> {
    if (!token || !data || role === data.user.role) return;
    setRoleBusy(true);
    setActionError(null);
    try {
      await api<RoleResponse>(`/admin/users/${data.user.id}/role`, {
        method: 'POST',
        token,
        body: JSON.stringify({ role }),
      });
      reload();
    } catch (err) {
      setActionError(describeApiError(err));
    } finally {
      setRoleBusy(false);
    }
  }

  const backLink = (
    <Link
      href="/admin/usuarios"
      className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition hover:text-ink"
    >
      <ArrowLeft className="h-4 w-4" />
      Volver a usuarios
    </Link>
  );

  if (loading) {
    return (
      <div>
        {backLink}
        <div className="animate-pulse space-y-6">
          <div className="h-52 rounded-2xl bg-surface-container" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="h-64 rounded-xl bg-white lg:col-span-2" />
            <div className="h-64 rounded-xl bg-white" />
          </div>
          <div className="h-40 rounded-xl bg-white" />
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div>
        {backLink}
        <PageHeader title="Usuario" />
        <ErrorBanner message={error} onRetry={reload} />
      </div>
    );
  }

  if (!data) return null;

  const { user, wallet, connect, rooms, photos, payouts, tips, recentLedger } = data;
  const blocked = user.blockedAt !== null;
  const openRooms = rooms.filter((r) => r.closedAt === null).length;

  const confirmMeta = (() => {
    if (!pending) return null;
    if (pending.kind === 'closeRoom') {
      return {
        title: 'Cerrar sala',
        description: `Se cerrará «${pending.room.name}» (/r/${pending.room.slug}) y se borrarán sus mensajes y archivos. Esta acción no se puede deshacer.`,
        confirmLabel: 'Cerrar sala',
        tone: 'danger' as const,
      };
    }
    if (pending.kind === 'block') {
      return {
        title: 'Bloquear usuario',
        description: `${user.displayName} (${user.email}) no podrá iniciar sesión ni usar la plataforma hasta que lo desbloquees.`,
        confirmLabel: 'Bloquear',
        tone: 'danger' as const,
      };
    }
    return {
      title: 'Desbloquear usuario',
      description: `${user.displayName} (${user.email}) podrá volver a iniciar sesión y usar tiptalk.chat.`,
      confirmLabel: 'Desbloquear',
      tone: 'primary' as const,
    };
  })();

  return (
    <div>
      {backLink}

      {error && <ErrorBanner message={error} onRetry={reload} className="mb-4" />}
      {actionError && <ErrorBanner message={actionError} className="mb-4" />}

      {/* === Hero === */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary-500 to-primary-500 p-6 text-white shadow-vivid-strong sm:p-8">
        <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-16 -left-8 h-44 w-44 rounded-full bg-white/10 blur-2xl" />

        <div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:text-left">
          <Avatar
            url={user.avatarUrl}
            name={user.displayName}
            size="lg"
            className="ring-4 ring-white/40 shadow-2xl"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h1 className="truncate font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                {user.displayName}
              </h1>
              <RolePill role={user.role} />
              {blocked && (
                <Badge tone="danger">
                  <Ban className="h-3 w-3" />
                  Bloqueado
                </Badge>
              )}
              {isSelf && <Badge tone="info">Tú</Badge>}
            </div>
            <p className="mt-1 text-sm text-white/85">{user.email}</p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-white/85 sm:justify-start">
              <span className="inline-flex items-center gap-1.5">
                <OnlineDot online={data.online} />
                {data.online ? 'Conectado ahora' : 'Desconectado'}
              </span>
              <span>Alta: {formatDate(user.createdAt)}</span>
              {blocked && <span>Bloqueado: {formatDate(user.blockedAt)}</span>}
              <span className="inline-flex items-center gap-1">
                {user.emailVerified ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <XCircle className="h-3.5 w-3.5" />
                )}
                Email {user.emailVerified ? 'verificado' : 'sin verificar'}
              </span>
              <span>KYC: {user.kycStatus}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="relative mt-6 flex flex-wrap items-center gap-2 border-t border-white/25 pt-5">
          <button
            type="button"
            onClick={() => setPending({ kind: blocked ? 'unblock' : 'block' })}
            disabled={isSelf || (!blocked && user.role === 'admin')}
            title={
              isSelf
                ? 'No puedes bloquearte a ti mismo'
                : !blocked && user.role === 'admin'
                  ? 'No se puede bloquear a otro administrador'
                  : undefined
            }
            className={`btn-tactile inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold shadow-soft transition hover:shadow-vivid disabled:cursor-not-allowed disabled:opacity-60 ${
              blocked ? 'text-emerald-700' : 'text-red-600'
            }`}
          >
            {blocked ? <ShieldOff className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
            {blocked ? 'Desbloquear' : 'Bloquear'}
          </button>

          <label className="inline-flex items-center gap-2 rounded-full bg-white/15 py-1 pl-4 pr-1.5 text-sm font-semibold backdrop-blur-sm">
            Rol
            <select
              value={user.role}
              disabled={isSelf || roleBusy}
              onChange={(e) => {
                const v = e.target.value;
                if (isRole(v)) void changeRole(v);
              }}
              title={isSelf ? 'No puedes cambiar tu propio rol' : undefined}
              className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-ink outline-none disabled:cursor-not-allowed disabled:opacity-70"
            >
              {ROLE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <a
            href={`/u/${user.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-tactile inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/25"
          >
            <ExternalLink className="h-4 w-4" />
            Ver perfil público
          </a>

          {refreshing && <span className="text-xs text-white/70">Actualizando…</span>}
        </div>
      </section>

      {/* === Wallet + Tips === */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <SectionCard
          title="Monedero"
          icon={<Wallet className="h-4 w-4" />}
          className="lg:col-span-2"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-surface-soft p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Saldo</p>
              <p className="mt-1 font-display text-2xl font-extrabold tracking-tight text-ink">
                {formatTipsys(wallet.balance)}
              </p>
              <p className="text-sm text-ink-muted">{tipsysToEur(wallet.balance)}</p>
            </div>
            <div className="rounded-lg bg-surface-soft p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Stripe Connect
              </p>
              {connect ? (
                <>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    {connect.payoutsEnabled ? (
                      <Badge tone="success">
                        <CheckCircle2 className="h-3 w-3" />
                        Payouts OK
                      </Badge>
                    ) : (
                      <Badge tone="warning">
                        <XCircle className="h-3 w-3" />
                        Payouts desactivados
                      </Badge>
                    )}
                    <Badge tone="neutral">{connect.status}</Badge>
                  </div>
                  <p className="mt-2 truncate font-mono text-xs text-ink-muted" title={connect.stripeAccountId}>
                    {connect.stripeAccountId}
                  </p>
                </>
              ) : (
                <p className="mt-1.5">
                  <Badge tone="neutral">Sin cuenta Connect</Badge>
                </p>
              )}
            </div>
          </div>

          <h3 className="mt-5 text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Últimos movimientos
          </h3>
          {recentLedger.length === 0 ? (
            <p className="mt-2 text-sm text-ink-muted">Sin movimientos todavía.</p>
          ) : (
            <ul className="mt-2 divide-y divide-surface-container rounded-lg border border-surface-container">
              {recentLedger.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">{ledgerKindLabel(e.kind)}</p>
                    <p className="text-xs text-ink-muted">{formatDate(e.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold tabular-nums ${
                        e.amount >= 0 ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {e.amount > 0 ? '+' : ''}
                      {formatInt(e.amount)} Tipsys
                    </p>
                    <p className="text-xs tabular-nums text-ink-muted">
                      Saldo: {formatInt(e.balanceAfter)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Tips" icon={<Coins className="h-4 w-4" />}>
          <div className="space-y-4">
            <div className="rounded-lg bg-surface-soft p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Recibidos
              </p>
              <p className="mt-1 font-display text-2xl font-extrabold tracking-tight text-ink">
                {formatInt(tips.received.count)}
              </p>
              <p className="text-sm text-ink-muted">
                {formatTipsys(tips.received.tipsys)} · {tipsysToEur(tips.received.tipsys)}
              </p>
            </div>
            <div className="rounded-lg bg-surface-soft p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Enviados
              </p>
              <p className="mt-1 font-display text-2xl font-extrabold tracking-tight text-ink">
                {formatInt(tips.sent.count)}
              </p>
              <p className="text-sm text-ink-muted">
                {formatTipsys(tips.sent.tipsys)} · {tipsysToEur(tips.sent.tipsys)}
              </p>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* === Rooms === */}
      <SectionCard
        title="Salas"
        icon={<MessagesSquare className="h-4 w-4" />}
        className="mt-6"
        action={
          <span className="text-xs text-ink-muted">
            {formatInt(openRooms)} abierta(s) · {formatInt(rooms.length)} en total
          </span>
        }
      >
        {rooms.length === 0 ? (
          <EmptyState
            icon={<MessagesSquare className="h-6 w-6" />}
            title="Este usuario no ha creado salas"
            className="border-0 py-8"
          />
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {rooms.map((r) => {
              const open = r.closedAt === null;
              return (
                <li
                  key={r.id}
                  className={`flex flex-col gap-2 rounded-xl border p-4 transition ${
                    open
                      ? 'border-surface-container bg-white hover:border-primary-300 hover:shadow-soft'
                      : 'border-surface-container bg-surface-soft/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-display font-bold text-ink">{r.name}</p>
                      <a
                        href={`/r/${r.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 truncate text-xs text-ink-muted hover:text-primary-600 hover:underline"
                      >
                        /r/{r.slug}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <Badge tone={open ? 'success' : 'neutral'}>{open ? 'Abierta' : 'Cerrada'}</Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
                    {r.liveCount > 0 ? (
                      <OnlineDot online label={`${r.liveCount} en directo`} />
                    ) : (
                      <OnlineDot online={false} label="Nadie en directo" />
                    )}
                    <span>{formatInt(r.membersCount)} miembro(s)</span>
                    <span>{formatInt(r.messagesCount)} mensaje(s)</span>
                  </div>
                  <p className="text-[11px] text-ink-soft">
                    Creada {formatDateShort(r.createdAt)}
                    {r.closedAt && ` · Cerrada ${formatDateShort(r.closedAt)}`}
                  </p>
                  {open && (
                    <button
                      type="button"
                      onClick={() => setPending({ kind: 'closeRoom', room: r })}
                      className="btn-tactile mt-1 inline-flex w-fit items-center gap-1.5 rounded-md bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                    >
                      <DoorClosed className="h-3.5 w-3.5" />
                      Cerrar sala
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </SectionCard>

      {/* === Gallery === */}
      <SectionCard
        title="Galería"
        icon={<ImageIcon className="h-4 w-4" />}
        className="mt-6"
        action={
          <span className="text-xs text-ink-muted">
            {formatInt(photos.length)} foto(s) · {formatInt(photos.filter((p) => p.isPublic).length)}{' '}
            pública(s)
          </span>
        }
      >
        {photos.length === 0 ? (
          <EmptyState
            icon={<ImageIcon className="h-6 w-6" />}
            title="Sin fotos en la galería"
            className="border-0 py-8"
          />
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {photos.map((p) => (
              <li
                key={p.id}
                className="group relative aspect-square overflow-hidden rounded-xl border border-surface-container bg-surface-soft shadow-soft"
              >
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="block h-full w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.url}
                    alt=""
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                </a>
                <span
                  className={`pointer-events-none absolute left-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm ${
                    p.isPublic ? 'bg-emerald-500/90 text-white' : 'bg-black/60 text-white'
                  }`}
                >
                  {p.isPublic ? <Eye className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                  {p.isPublic ? 'Pública' : 'Privada'}
                </span>
                <span className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm">
                  {formatDateShort(p.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      {/* === Payouts === */}
      <SectionCard
        title="Payouts"
        icon={<Banknote className="h-4 w-4" />}
        className="mt-6"
        flush
        action={
          <Link href="/admin/payouts" className="text-xs font-semibold text-primary-600 hover:underline">
            Ver todos los payouts
          </Link>
        }
      >
        {payouts.length === 0 ? (
          <EmptyState
            icon={<Banknote className="h-6 w-6" />}
            title="Sin solicitudes de cobro"
            className="border-0 py-8"
          />
        ) : (
          <TableShell>
            <TableHead>
              <Th>ID</Th>
              <Th align="right">Tipsys</Th>
              <Th align="right">Neto</Th>
              <Th>Estado</Th>
              <Th>Solicitado</Th>
              <Th>Pagado</Th>
            </TableHead>
            <tbody>
              {payouts.map((p, i) => (
                <Tr key={p.id} index={i}>
                  <Td className="font-mono text-xs text-ink-muted">
                    <span title={p.id}>{p.id.slice(0, 8)}…</span>
                  </Td>
                  <Td align="right" className="tabular-nums">
                    {formatInt(p.tipsys)}
                  </Td>
                  <Td align="right" className="font-semibold tabular-nums">
                    {formatEurCents(p.netEurCents)}
                  </Td>
                  <Td>
                    <PayoutStatusBadge status={p.status} />
                  </Td>
                  <Td className="whitespace-nowrap text-ink-muted">{formatDate(p.createdAt)}</Td>
                  <Td className="whitespace-nowrap text-ink-muted">{formatDate(p.paidAt)}</Td>
                </Tr>
              ))}
            </tbody>
          </TableShell>
        )}
      </SectionCard>

      <ConfirmDialog
        open={pending !== null && confirmMeta !== null}
        title={confirmMeta?.title ?? ''}
        description={confirmMeta?.description}
        confirmLabel={confirmMeta?.confirmLabel}
        tone={confirmMeta?.tone ?? 'danger'}
        busy={busy}
        onConfirm={() => void runPending()}
        onCancel={() => {
          if (!busy) setPending(null);
        }}
      />
    </div>
  );
}
