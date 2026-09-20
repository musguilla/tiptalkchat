'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { Cctv, Circle, Eye, Radio, Users, VideoOff } from 'lucide-react';
import { useT } from '@/i18n/useLocale';
import { useAdminFetch } from '../_components/useAdminFetch';
import { PageHeader } from '../_components/PageHeader';
import { Avatar } from '../_components/Avatar';
import { Badge } from '../_components/Badge';
import { CardSkeleton, EmptyState, ErrorBanner } from '../_components/Feedback';
import { formatInt } from '../_components/format';
import type { AdminLiveCall, AdminLiveCallsResponse } from '../_components/types';

const POLL_MS = 5000;

export default function AdminCamarasPage() {
  const t = useT();
  const { data, loading, refreshing, error, reload } =
    useAdminFetch<AdminLiveCallsResponse>('/admin/calls');

  // Poll so the grid tracks calls starting/ending without a manual refresh.
  useEffect(() => {
    const t = setInterval(reload, POLL_MS);
    return () => clearInterval(t);
  }, [reload]);

  const calls = data?.calls ?? [];

  return (
    <div>
      <PageHeader
        title={t('adb.cam.title')}
        subtitle={t('adb.cam.subtitle')}
        refreshing={refreshing}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-soft px-3 py-1.5 text-xs font-medium text-ink-muted">
          <Radio className="h-3.5 w-3.5 text-emerald-500" />
          {t('adb.cam.refresh5s')}
        </span>
      </PageHeader>

      {error && <ErrorBanner message={error} onRetry={reload} className="mb-4" />}

      {data && !data.configured ? (
        <EmptyState
          icon={<VideoOff className="h-6 w-6" />}
          title={t('adb.cam.notConfigured.title')}
          hint={t('adb.cam.notConfigured.hint')}
        />
      ) : loading ? (
        <CardSkeleton count={4} />
      ) : calls.length === 0 ? (
        <EmptyState
          icon={<Cctv className="h-6 w-6" />}
          title={t('adb.cam.empty.title')}
          hint={t('adb.cam.empty.hint')}
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {calls.map((c) => (
            <LiveCallCard key={c.slug} call={c} />
          ))}
        </ul>
      )}

      {data && data.configured && !data.recordingAvailable && calls.length > 0 && (
        <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          {t('adb.cam.recWarn.before')}
          <code className="mx-1 rounded bg-amber-100 px-1 py-0.5">LIVEKIT_RECORD_S3_*</code>
          {t('adb.cam.recWarn.after')}
        </p>
      )}
    </div>
  );
}

function LiveCallCard({ call }: { call: AdminLiveCall }) {
  const t = useT();
  const creator = call.creator;
  return (
    <li className="flex flex-col overflow-hidden rounded-xl border border-surface-container bg-white shadow-soft transition hover:border-primary-300 hover:shadow-vivid">
      <div className="relative flex aspect-video items-center justify-center bg-zinc-900">
        <Cctv className="h-10 w-10 text-white/30" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow">
          <Circle className="h-2 w-2 animate-pulse fill-current" />
          {t('adb.cam.live')}
        </span>
        {call.recording && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white">
            <Circle className="h-2 w-2 animate-pulse fill-red-500 text-red-500" />
            {t('adb.cam.recording')}
          </span>
        )}
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[11px] font-medium text-white">
          <Users className="h-3 w-3" />
          {formatInt(call.participants)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="min-w-0">
          <p className="flex items-center gap-2 truncate font-display font-bold text-ink">
            {call.name}
            {call.closed && <Badge tone="neutral">{t('adb.cam.closed')}</Badge>}
          </p>
          <p className="truncate text-xs text-ink-muted">/r/{call.slug}</p>
        </div>

        {creator && (
          <div className="flex items-center gap-2">
            <Avatar url={creator.avatarUrl} name={creator.displayName} size="sm" />
            <span className="truncate text-sm text-ink-muted">
              {creator.displayName}
              {creator.kind === 'guest' && (
                <span className="ml-1.5 align-middle">
                  <Badge tone="neutral">{t('adb.cam.guest')}</Badge>
                </span>
              )}
            </span>
          </div>
        )}

        <div className="mt-auto">
          {call.roomId ? (
            <Link
              href={`/admin/camaras/${call.roomId}`}
              className="btn-tactile inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-secondary-500 to-primary-500 px-4 py-2.5 text-sm font-bold text-white shadow-soft hover:shadow-vivid"
            >
              <Eye className="h-4 w-4" />
              {t('adb.cam.watch')}
            </Link>
          ) : (
            <span className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-surface-soft px-4 py-2.5 text-sm font-medium text-ink-soft">
              {t('adb.cam.roomUnregistered')}
            </span>
          )}
        </div>
      </div>
    </li>
  );
}
