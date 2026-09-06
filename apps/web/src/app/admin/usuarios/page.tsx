'use client';
import { Suspense, useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Ban, ShieldOff, Users as UsersIcon } from 'lucide-react';
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
                      {canToggle ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPending(u);
                          }}
                          className={`btn-tactile inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                            u.blockedAt
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                        >
                          {u.blockedAt ? (
                            <>
                              <ShieldOff className="h-3.5 w-3.5" />
                              Desbloquear
                            </>
                          ) : (
                            <>
                              <Ban className="h-3.5 w-3.5" />
                              Bloquear
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-xs text-ink-soft">—</span>
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
    </div>
  );
}
