'use client';
import { Suspense, useCallback, useState } from 'react';
import Link from 'next/link';
import { DoorClosed, Eye, MessagesSquare } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { useT } from '@/i18n/useLocale';
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

function readStatus(raw: string | null): RoomStatusFilter {
  return raw === 'closed' || raw === 'all' ? raw : 'open';
}

export default function AdminRoomsPage() {
  const t = useT();
  return (
    <Suspense fallback={<PageHeader title={t('adm.rooms.title')} />}>
      <RoomsPageInner />
    </Suspense>
  );
}

function RoomsPageInner() {
  const t = useT();
  const token = useAuth((s) => s.token);
  const { searchParams, set } = useUrlState();
  const statusTabs: TabItem<RoomStatusFilter>[] = [
    { key: 'open', label: t('adm.rooms.tab.open') },
    { key: 'closed', label: t('adm.rooms.tab.closed') },
    { key: 'all', label: t('adm.rooms.tab.all') },
  ];
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
        title={t('adm.rooms.title')}
        subtitle={t('adm.rooms.subtitle')}
        refreshing={refreshing}
      >
        <SearchInput
          initial={q}
          onCommit={commitSearch}
          placeholder={t('adm.rooms.searchPlaceholder')}
          className="w-full sm:w-72"
        />
      </PageHeader>

      <div className="mb-4">
        <Tabs
          items={statusTabs}
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
                ? t('adm.rooms.emptySearch', { q })
                : status === 'open'
                  ? t('adm.rooms.emptyOpen')
                  : status === 'closed'
                    ? t('adm.rooms.emptyClosed')
                    : t('adm.rooms.empty')
            }
            className="border-0"
          />
        ) : (
          <TableShell minWidth="min-w-[900px]">
            <TableHead>
              <Th>{t('adm.rooms.col.room')}</Th>
              <Th>{t('adm.rooms.col.creator')}</Th>
              <Th>{t('adm.rooms.col.live')}</Th>
              <Th align="right">{t('adm.rooms.col.members')}</Th>
              <Th align="right">{t('adm.rooms.col.messages')}</Th>
              <Th>{t('adm.rooms.col.created')}</Th>
              <Th>{t('adm.rooms.col.closed')}</Th>
              <Th align="right">{t('adm.common.actions')}</Th>
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
                          <Badge tone={open ? 'success' : 'neutral'}>{open ? t('adm.common.roomOpen') : t('adm.common.roomClosed')}</Badge>
                        </p>
                        <Link
                          href={`/admin/salas/${r.id}`}
                          className="inline-flex items-center gap-1 text-xs text-ink-muted hover:text-primary-600 hover:underline"
                          title={t('adm.rooms.observeTitle')}
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
                          <Badge tone="neutral">{t('adm.common.guest')}</Badge>
                          <span className="truncate">{r.creator.displayName}</span>
                        </span>
                      )}
                    </Td>
                    <Td>
                      <OnlineDot
                        online={r.liveCount > 0}
                        label={r.liveCount > 0 ? t('adm.rooms.liveCount', { n: formatInt(r.liveCount) }) : t('adm.rooms.nobody')}
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
                          {t('adm.common.close')}
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
        title={t('adm.rooms.closeTitle')}
        description={
          pending
            ? t('adm.rooms.closeDesc', { name: pending.name, slug: pending.slug })
            : undefined
        }
        confirmLabel={t('adm.rooms.close')}
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
