'use client';
import { useEffect, useState } from 'react';
import {
  Activity,
  Banknote,
  Coins,
  Mail,
  MessagesSquare,
  RefreshCw,
  UserX,
  Users,
} from 'lucide-react';
import { useT } from '@/i18n/useLocale';
import { useAdminFetch } from './_components/useAdminFetch';
import { StatTile, type StatTileProps } from './_components/StatTile';
import { PageHeader } from './_components/PageHeader';
import { ErrorBanner } from './_components/Feedback';
import { formatEurCents, formatInt, formatTipsys, tipsysToEur } from './_components/format';
import type { AdminStats } from './_components/types';

const POLL_MS = 30_000;

export default function AdminDashboardPage() {
  const t = useT();
  const { data, loading, refreshing, error, reload } = useAdminFetch<AdminStats>('/admin/stats');
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  useEffect(() => {
    if (data) setUpdatedAt(new Date());
  }, [data]);

  useEffect(() => {
    const id = window.setInterval(reload, POLL_MS);
    return () => window.clearInterval(id);
  }, [reload]);

  const tiles: StatTileProps[] = data
    ? [
        {
          label: t('adm.dash.users'),
          value: formatInt(data.users.total),
          sub: t('adm.dash.users.sub', { n: formatInt(data.users.last7d) }),
          href: '/admin/usuarios',
          tone: 'primary',
          icon: <Users className="h-4 w-4" />,
        },
        {
          label: t('adm.dash.blocked'),
          value: formatInt(data.users.blocked),
          sub: t('adm.dash.blocked.sub'),
          href: '/admin/usuarios',
          tone: data.users.blocked > 0 ? 'danger' : 'default',
          icon: <UserX className="h-4 w-4" />,
        },
        {
          label: t('adm.dash.roomsOpen'),
          value: formatInt(data.rooms.open),
          sub: t('adm.dash.roomsOpen.sub', { n: formatInt(data.rooms.createdLast7d) }),
          href: '/admin/salas',
          tone: 'default',
          icon: <MessagesSquare className="h-4 w-4" />,
        },
        {
          label: t('adm.dash.online'),
          value: formatInt(data.online.users),
          sub: t('adm.dash.online.sub', { n: formatInt(data.online.sockets) }),
          href: '/admin/usuarios',
          tone: data.online.users > 0 ? 'success' : 'default',
          icon: <Activity className="h-4 w-4" />,
        },
        {
          label: t('adm.dash.tips7d'),
          value: formatInt(data.tips.count7d),
          sub: `${tipsysToEur(data.tips.tipsys7d)} · ${formatTipsys(data.tips.tipsys7d)}`,
          href: '/admin/payouts',
          tone: 'default',
          icon: <Coins className="h-4 w-4" />,
        },
        {
          label: t('adm.dash.tipsTotal'),
          value: formatInt(data.tips.countTotal),
          sub: `${tipsysToEur(data.tips.tipsysTotal)} · ${formatTipsys(data.tips.tipsysTotal)}`,
          href: '/admin/payouts',
          tone: 'default',
          icon: <Coins className="h-4 w-4" />,
        },
        {
          label: t('adm.dash.payoutsPending'),
          value: formatInt(data.payouts.pending),
          sub: t('adm.dash.payoutsPending.sub', { amount: formatEurCents(data.payouts.pendingNetEurCents) }),
          href: '/admin/payouts',
          tone: data.payouts.pending > 0 ? 'warning' : 'default',
          icon: <Banknote className="h-4 w-4" />,
        },
        {
          label: t('adm.dash.contact'),
          value: formatInt(data.contacts.new),
          sub: t('adm.dash.contact.sub'),
          href: '/admin/contacto',
          tone: data.contacts.new > 0 ? 'primary' : 'default',
          icon: <Mail className="h-4 w-4" />,
        },
      ]
    : [];

  return (
    <div>
      <PageHeader
        title={t('adm.dash.title')}
        subtitle={t('adm.dash.subtitle')}
        refreshing={refreshing}
      >
        {updatedAt && (
          <span className="text-xs text-ink-muted">
            {t('adm.dash.updatedAt', { time: updatedAt.toLocaleTimeString('es-ES') })}
          </span>
        )}
        <button
          type="button"
          onClick={reload}
          disabled={loading || refreshing}
          className="btn-tactile inline-flex h-9 items-center gap-1.5 rounded-full border border-surface-container bg-white px-3.5 text-sm font-semibold text-ink shadow-soft transition hover:bg-surface-soft disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          {t('adm.common.refresh')}
        </button>
      </PageHeader>

      {error && <ErrorBanner message={error} onRetry={reload} className="mb-5" />}

      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-xl border border-surface-container bg-white"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {tiles.map((t) => (
            <StatTile key={t.label} {...t} />
          ))}
        </div>
      )}
    </div>
  );
}
