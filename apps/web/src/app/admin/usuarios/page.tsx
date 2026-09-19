'use client';
import { Suspense, useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Ban, Loader2, ShieldOff, Trash2, Users as UsersIcon } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useAdminFetch } from '../_components/useAdminFetch';
import { readPage, useUrlState } from '../_components/useUrlState';
import { PageHeader } from '../_components/PageHeader';
import { SearchInput } from '../_components/SearchInput';
import { Pagination } from '../_components/Pagination';
import { Avatar } from '../_components/Avatar';
import { Badge } from '../_components/Badge';
import { OnlineDot } from '../_components/OnlineDot';
import { RolePill } from '../_components/RolePill';
import { RowMenu } from '../_components/RowMenu';
import { EmptyState, ErrorBanner, TableSkeleton } from '../_components/Feedback';
import { TableHead, TableShell, Td, Th, Tr } from '../_components/DataTable';
import { describeApiError, formatDateShort, formatTipsys, tipsysToEur } from '../_components/format';
import type { AdminUserRow, AdminUsersResponse, BlockResponse } from '../_components/types';

const LIMIT = 25;

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<PageHeader title="Usuarios" />}>
      <UsersPageInner />
    </Suspense>
  );
}

function UsersPageInner() {
  const router = useRouter();
  const token = useAuth((s) => s.token);
  const meId = useAuth((s) => s.user?.id);
  const { searchParams, set } = useUrlState();
  const q = searchParams.get('q') ?? '';
  const page = readPage(searchParams);

  const path = `/admin/users?q=${encodeURIComponent(q)}&page=${page}&limit=${LIMIT}`;
  const { data, loading, refreshing, error, reload } = useAdminFetch<AdminUsersResponse>(path);

  const [pending, setPending] = useState<AdminUserRow | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUserRow | null>(null);
  const [deleteMedia, setDeleteMedia] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const commitSearch = useCallback(
    (next: string) => set({ q: next, page: null }),
    [set],
  );

  async function confirmToggleBlock(): Promise<void> {
    if (!pending || !token) return;
    setBusy(true);
    setActionError(null);
    const action = pending.blockedAt ? 'unblock' : 'block';
    try {
      await api<BlockResponse>(`/admin/users/${pending.id}/${action}`, { method: 'POST', token });
      setPending(null);
      reload();
    } catch (err) {
      setActionError(describeApiError(err));
      setPending(null);
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete(): Promise<void> {
    if (!deleteTarget || !token) return;
    setDeleteBusy(true);
    setDeleteError(null);
    try {
      await api(`/admin/users/${deleteTarget.id}?deleteMedia=${deleteMedia}`, {
        method: 'DELETE',
        token,
      });
      setDeleteTarget(null);
      setDeleteMedia(false);
      reload();
    } catch (err) {
      setDeleteError(describeApiError(err));
    } finally {
      setDeleteBusy(false);
    }
  }

  const rows = data?.users ?? [];

  return (
    <div>
      <PageHeader
        title="Usuarios"
        subtitle="Cuentas registradas, monedero y estado de conexión."
        refreshing={refreshing}
      >
        <SearchInput
          initial={q}
          onCommit={commitSearch}
          placeholder="Buscar por email o nombre…"
          className="w-full sm:w-72"
        />
      </PageHeader>

      {error && <ErrorBanner message={error} onRetry={reload} className="mb-4" />}
      {actionError && <ErrorBanner message={actionError} className="mb-4" />}

      <div className="overflow-hidden rounded-xl border border-surface-container bg-white shadow-soft">
        {loading ? (
          <TableSkeleton rows={8} cols={6} />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={<UsersIcon className="h-6 w-6" />}
            title={q ? `Sin resultados para «${q}»` : 'Todavía no hay usuarios'}
            hint={q ? 'Prueba con otro email o nombre.' : undefined}
            className="border-0"
          />
        ) : (
          <TableShell minWidth="min-w-[820px]">
            <TableHead>
              <Th>Usuario</Th>
              <Th>Rol</Th>
              <Th>Estado</Th>
              <Th align="right">Monedero</Th>
              <Th align="right">Salas</Th>
              <Th>Alta</Th>
              <Th align="right">Acciones</Th>
            </TableHead>
            <tbody>
              {rows.map((u, i) => {
                const isSelf = u.id === meId;
                const canToggle = !isSelf && u.role !== 'admin';
                return (
                  <Tr
                    key={u.id}
                    index={i}
                    onClick={() => router.push(`/admin/usuarios/${u.id}`)}
                  >
                    <Td>
                      <div className="flex items-center gap-3">
                        <Avatar url={u.avatarUrl} name={u.displayName} size="md" />
                        <div className="min-w-0">
                          <p className="flex items-center gap-2 truncate font-semibold text-ink">
                            <Link
                              href={`/admin/usuarios/${u.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="truncate hover:text-primary-600 hover:underline"
                            >
                              {u.displayName}
                            </Link>
                            {u.blockedAt && (
                              <Badge tone="danger">
                                <Ban className="h-3 w-3" />
                                Bloqueado
                              </Badge>
                            )}
                            {isSelf && <Badge tone="info">Tú</Badge>}
                          </p>
                          <p className="truncate text-xs text-ink-muted">{u.email}</p>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <RolePill role={u.role} />
                    </Td>
                    <Td>
                      <OnlineDot online={u.online} label={u.online ? 'En línea' : 'Desconectado'} />
                    </Td>
                    <Td align="right">
                      <p className="font-semibold tabular-nums text-ink">{formatTipsys(u.walletBalance)}</p>
                      <p className="text-xs tabular-nums text-ink-muted">{tipsysToEur(u.walletBalance)}</p>
                    </Td>
                    <Td align="right" className="tabular-nums">
                      {u.openRooms}
                    </Td>
                    <Td className="whitespace-nowrap text-ink-muted">{formatDateShort(u.createdAt)}</Td>
                    <Td align="right">
                      {isSelf ? (
                        <span className="text-xs text-ink-soft">—</span>
                      ) : (
                        <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                          <RowMenu
                            items={[
                              ...(canToggle
                                ? [
                                    {
                                      key: 'block',
                                      label: u.blockedAt ? 'Desbloquear' : 'Bloquear',
                                      icon: u.blockedAt ? (
                                        <ShieldOff className="h-4 w-4" />
                                      ) : (
                                        <Ban className="h-4 w-4" />
                                      ),
                                      onClick: () => setPending(u),
                                    },
                                  ]
                                : []),
                              {
                                key: 'delete',
                                label: 'Eliminar usuario',
                                icon: <Trash2 className="h-4 w-4" />,
                                tone: 'danger' as const,
                                onClick: () => {
                                  setDeleteMedia(false);
                                  setDeleteError(null);
                                  setDeleteTarget(u);
                                },
                              },
                            ]}
                          />
                        </div>
                      )}
                    </Td>
                  </Tr>
                );
              })}
            </tbody>
          </TableShell>
        )}
        {data && rows.length > 0 && (
          <div className="border-t border-surface-container px-4 py-3">
            <Pagination
              page={data.page}
              limit={data.limit}
              total={data.total}
              disabled={refreshing}
              onPage={(p) => set({ page: p <= 1 ? null : String(p) })}
            />
          </div>
        )}
      </div>

      <ConfirmDialog
        open={pending !== null}
        title={pending?.blockedAt ? 'Desbloquear usuario' : 'Bloquear usuario'}
        description={
          pending
            ? pending.blockedAt
              ? `${pending.displayName} (${pending.email}) podrá volver a iniciar sesión y usar tiptalk.chat.`
              : `${pending.displayName} (${pending.email}) no podrá iniciar sesión ni usar la plataforma hasta que lo desbloquees.`
            : undefined
        }
        confirmLabel={pending?.blockedAt ? 'Desbloquear' : 'Bloquear'}
        tone={pending?.blockedAt ? 'primary' : 'danger'}
        busy={busy}
        onConfirm={() => void confirmToggleBlock()}
        onCancel={() => {
          if (!busy) setPending(null);
        }}
      />

      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => {
            if (!deleteBusy) setDeleteTarget(null);
          }}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-vivid-strong"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-surface-container px-5 py-4">
              <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-red-600">
                <Trash2 className="h-5 w-5" /> Eliminar usuario
              </h2>
            </div>
            <div className="p-5">
              <p className="text-sm text-ink">
                Vas a eliminar a <strong>{deleteTarget.displayName}</strong> ({deleteTarget.email}) y{' '}
                <strong>todas sus salas</strong>, mensajes, monedero, propinas y seguidores. Esta acción
                no se puede deshacer.
              </p>
              <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-surface-container bg-surface-soft/50 p-3">
                <input
                  type="checkbox"
                  checked={deleteMedia}
                  onChange={(e) => setDeleteMedia(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-red-600"
                />
                <span className="text-sm text-ink">
                  <span className="font-semibold">Borrar también todo su media</span>
                  <span className="mt-0.5 block text-xs text-ink-muted">
                    Avatar, fotos de su galería y los archivos que subió a los chats. Si lo dejas sin
                    marcar, esos archivos se conservan en el almacenamiento.
                  </span>
                </span>
              </label>
              {deleteError && (
                <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {deleteError}
                </p>
              )}
              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  disabled={deleteBusy}
                  onClick={() => setDeleteTarget(null)}
                  className="rounded-full px-4 py-2 text-sm font-semibold text-ink-muted transition hover:bg-surface-soft disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={deleteBusy}
                  onClick={() => void confirmDelete()}
                  className="btn-tactile inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
                >
                  {deleteBusy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Eliminar definitivamente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
