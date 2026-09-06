'use client';
import { Suspense, useCallback, useState } from 'react';
import Link from 'next/link';
import { DoorClosed, Eye, MessagesSquare } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useAdminFetch } from '../_components/useAdminFetch';
import { readPage, useUrlState } from '../_components/useUrlState';
import { PageHeader } from '../_components/PageHeader';
import { SearchInput } from '../_components/SearchInput';
import { Tabs, type TabItem } from '../_components/Tabs';
import { Pagination } from '../_components/Pagination';
import { Avatar } from '../_components/Avatar';
import { Badge } from '../_components/Badge';
import { OnlineDot } from '../_components/OnlineDot';
import { EmptyState, ErrorBanner, TableSkeleton } from '../_components/Feedback';
import { TableHead, TableShell, Td, Th, Tr } from '../_components/DataTable';
import { describeApiError, formatDate, formatInt } from '../_components/format';
import type {
  AdminRoomRow,
  AdminRoomsResponse,
  CloseRoomResponse,
  RoomStatusFilter,
} from '../_components/types';

const LIMIT = 25;

const STATUS_TABS: ReadonlyArray<TabItem<RoomStatusFilter>> = [
  { key: 'open', label: 'Abiertas' },
  { key: 'closed', label: 'Cerradas' },
  { key: 'all', label: 'Todas' },
];

function readStatus(raw: string | null): RoomStatusFilter {
  return raw === 'closed' || raw === 'all' ? raw : 'open';
}

export default function AdminRoomsPage() {
  return (
    <Suspense fallback={<PageHeader title="Salas" />}>
      <RoomsPageInner />
    </Suspense>
  );
}

function RoomsPageInner() {
  const token = useAuth((s) => s.token);
  const { searchParams, set } = useUrlState();
  const status = readStatus(searchParams.get('status'));
  const q = searchParams.get('q') ?? '';
  const page = readPage(searchParams);

  const path = `/admin/rooms?status=${status}&q=${encodeURIComponent(q)}&page=${page}&limit=${LIMIT}`;
  const { data, loading, refreshing, error, reload } = useAdminFetch<AdminRoomsResponse>(path);

  const [pending, setPending] = useState<AdminRoomRow | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const commitSearch = useCallback((next: string) => set({ q: next, page: null }), [set]);

  async function confirmClose(): Promise<void> {
    if (!pending || !token) return;
    setBusy(true);
    setActionError(null);
    try {
      await api<CloseRoomResponse>(`/admin/rooms/${pending.id}/close`, { method: 'POST', token });
      setPending(null);
      reload();
    } catch (err) {
      setActionError(describeApiError(err));
      setPending(null);
    } finally {
      setBusy(false);
    }
  }

  const rows = data?.rooms ?? [];

  return (
    <div>
      <PageHeader
        title="Salas"
        subtitle="Salas de chat creadas por usuarios e invitados."
        refreshing={refreshing}
      >
        <SearchInput
          initial={q}
          onCommit={commitSearch}
          placeholder="Buscar por nombre o slug…"
          className="w-full sm:w-72"
        />
      </PageHeader>

      <div className="mb-4">
        <Tabs
          items={STATUS_TABS}
          value={status}
          onChange={(key) => set({ status: key === 'open' ? null : key, page: null })}
        />
      </div>

      {error && <ErrorBanner message={error} onRetry={reload} className="mb-4" />}
      {actionError && <ErrorBanner message={actionError} className="mb-4" />}

      <div className="overflow-hidden rounded-xl border border-surface-container bg-white shadow-soft">
        {loading ? (
          <TableSkeleton rows={8} cols={7} />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={<MessagesSquare className="h-6 w-6" />}
            title={
              q
                ? `Sin salas para «${q}»`
                : status === 'open'
                  ? 'No hay salas abiertas ahora mismo'
                  : status === 'closed'
                    ? 'No hay salas cerradas'
                    : 'Todavía no hay salas'
            }
            className="border-0"
          />
        ) : (
          <TableShell minWidth="min-w-[900px]">
            <TableHead>
              <Th>Sala</Th>
              <Th>Creador</Th>
              <Th>En directo</Th>
              <Th align="right">Miembros</Th>
              <Th align="right">Mensajes</Th>
              <Th>Creada</Th>
              <Th>Cerrada</Th>
              <Th align="right">Acciones</Th>
            </TableHead>
            <tbody>
              {rows.map((r, i) => {
                const open = r.closedAt === null;
                return (
                  <Tr key={r.id} index={i}>
                    <Td>
                      <div className="min-w-0">
                        <p className="flex items-center gap-2 truncate font-semibold text-ink">
                          {r.name}
                          <Badge tone={open ? 'success' : 'neutral'}>{open ? 'Abierta' : 'Cerrada'}</Badge>
                        </p>
                        <Link
                          href={`/admin/salas/${r.id}`}
                          className="inline-flex items-center gap-1 text-xs text-ink-muted hover:text-primary-600 hover:underline"
                          title="Ver la conversación como observador (no te une a la sala)"
                        >
                          /r/{r.slug}
                          <Eye className="h-3 w-3" />
                        </Link>
                      </div>
                    </Td>
                    <Td>
                      {r.creator === null ? (
                        <span className="text-xs text-ink-soft">—</span>
                      ) : r.creator.kind === 'user' ? (
                        <Link
                          href={`/admin/usuarios/${r.creator.id}`}
                          className="inline-flex max-w-[220px] items-center gap-2 hover:text-primary-600"
                        >
                          <Avatar url={r.creator.avatarUrl} name={r.creator.displayName} size="sm" />
                          <span className="truncate font-medium hover:underline">
                            {r.creator.displayName}
                          </span>
                        </Link>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-ink-muted">
                          <Badge tone="neutral">invitado</Badge>
                          <span className="truncate">{r.creator.displayName}</span>
                        </span>
                      )}
                    </Td>
                    <Td>
                      <OnlineDot
                        online={r.liveCount > 0}
                        label={r.liveCount > 0 ? `${formatInt(r.liveCount)} en directo` : 'Nadie'}
                      />
                    </Td>
                    <Td align="right" className="tabular-nums">
                      {formatInt(r.membersCount)}
                    </Td>
                    <Td align="right" className="tabular-nums">
                      {formatInt(r.messagesCount)}
                    </Td>
                    <Td className="whitespace-nowrap text-ink-muted">{formatDate(r.createdAt)}</Td>
                    <Td className="whitespace-nowrap text-ink-muted">{formatDate(r.closedAt)}</Td>
                    <Td align="right">
                      {open ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPending(r);
                          }}
                          className="btn-tactile inline-flex items-center gap-1.5 rounded-md bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                        >
                          <DoorClosed className="h-3.5 w-3.5" />
                          Cerrar
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
        title="Cerrar sala"
        description={
          pending
            ? `Se cerrará «${pending.name}» (/r/${pending.slug}) y se borrarán sus mensajes y archivos. Esta acción no se puede deshacer.`
            : undefined
        }
        confirmLabel="Cerrar sala"
        tone="danger"
        busy={busy}
        onConfirm={() => void confirmClose()}
        onCancel={() => {
          if (!busy) setPending(null);
        }}
      />
    </div>
  );
}
