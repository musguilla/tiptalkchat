'use client';
import { Suspense, useState } from 'react';
import { Archive, Loader2, Mail, MailOpen, Reply, RotateCcw } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { useT } from '@/i18n/useLocale';
import { useAdminFetch } from '../_components/useAdminFetch';
import { useUrlState } from '../_components/useUrlState';
import { PageHeader } from '../_components/PageHeader';
import { Tabs, type TabItem } from '../_components/Tabs';
import { ContactStatusBadge } from '../_components/Badge';
import { CardSkeleton, EmptyState, ErrorBanner } from '../_components/Feedback';
import { describeApiError, formatDate } from '../_components/format';
import type { AdminContactRow, AdminContactsResponse, ContactStatus } from '../_components/types';

type ContactTab = ContactStatus | 'all';

function readTab(raw: string | null): ContactTab {
  return raw === 'read' || raw === 'archived' || raw === 'all' ? raw : 'new';
}

export default function AdminContactsPage() {
  const t = useT();
  return (
    <Suspense fallback={<PageHeader title={t('adb.contact.title')} />}>
      <ContactsPageInner />
    </Suspense>
  );
}

function ContactsPageInner() {
  const t = useT();
  const token = useAuth((s) => s.token);
  const { searchParams, set } = useUrlState();
  const tab = readTab(searchParams.get('status'));

  const TABS: ReadonlyArray<TabItem<ContactTab>> = [
    { key: 'new', label: t('adb.contact.tab.new') },
    { key: 'read', label: t('adb.contact.tab.read') },
    { key: 'archived', label: t('adb.contact.tab.archived') },
    { key: 'all', label: t('adb.contact.tab.all') },
  ];

  const { data, loading, refreshing, error, reload } = useAdminFetch<AdminContactsResponse>(
    `/admin/contacts?status=${tab}`,
  );

  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function setStatus(contact: AdminContactRow, status: ContactStatus): Promise<void> {
    if (!token || busyId) return;
    setBusyId(contact.id);
    setActionError(null);
    try {
      await api<AdminContactRow>(`/admin/contacts/${contact.id}/status`, {
        method: 'POST',
        token,
        body: JSON.stringify({ status }),
      });
      reload();
    } catch (err) {
      setActionError(describeApiError(err));
    } finally {
      setBusyId(null);
    }
  }

  const rows = data?.contacts ?? [];

  const actionBtn =
    'btn-tactile inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <div>
      <PageHeader
        title={t('adb.contact.title')}
        subtitle={t('adb.contact.subtitle')}
        refreshing={refreshing}
      />

      <div className="mb-4">
        <Tabs items={TABS} value={tab} onChange={(key) => set({ status: key === 'new' ? null : key })} />
      </div>

      {error && <ErrorBanner message={error} onRetry={reload} className="mb-4" />}
      {actionError && <ErrorBanner message={actionError} className="mb-4" />}

      {loading ? (
        <CardSkeleton count={4} />
      ) : rows.length === 0 ? (
        <EmptyState
          icon={<Mail className="h-6 w-6" />}
          title={
            tab === 'new'
              ? t('adb.contact.empty.new')
              : tab === 'all'
                ? t('adb.contact.empty.all')
                : t('adb.contact.empty.state')
          }
        />
      ) : (
        <ul className="space-y-3">
          {rows.map((c) => {
            const busy = busyId === c.id;
            return (
              <li key={c.id}>
                <article
                  className={`rounded-xl border bg-white p-4 shadow-soft sm:p-5 ${
                    c.status === 'new' ? 'border-primary-200' : 'border-surface-container'
                  }`}
                >
                  <header className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-center gap-2 font-semibold text-ink">
                        <span className="truncate">{c.name}</span>
                        <ContactStatusBadge status={c.status} />
                      </p>
                      <a
                        href={`mailto:${c.email}`}
                        className="text-xs text-ink-muted hover:text-primary-600 hover:underline"
                      >
                        {c.email}
                      </a>
                    </div>
                    <time dateTime={c.createdAt} className="text-xs text-ink-muted">
                      {formatDate(c.createdAt)}
                    </time>
                  </header>

                  <h2 className="mt-3 font-display text-base font-bold tracking-tight text-ink">
                    {c.subject}
                  </h2>
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-ink-muted">
                    {c.message}
                  </p>

                  <footer className="mt-4 flex flex-wrap items-center gap-2 border-t border-surface-container pt-3">
                    <a
                      href={`mailto:${c.email}?subject=${encodeURIComponent(`Re: ${c.subject}`)}`}
                      className={`${actionBtn} bg-primary-50 text-primary-700 hover:bg-primary-100`}
                    >
                      <Reply className="h-3.5 w-3.5" />
                      {t('adb.contact.reply')}
                    </a>
                    {c.status === 'new' && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void setStatus(c, 'read')}
                        className={`${actionBtn} bg-surface-soft text-ink hover:bg-surface-container`}
                      >
                        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MailOpen className="h-3.5 w-3.5" />}
                        {t('adb.contact.markRead')}
                      </button>
                    )}
                    {c.status !== 'archived' && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void setStatus(c, 'archived')}
                        className={`${actionBtn} bg-surface-soft text-ink-muted hover:bg-surface-container`}
                      >
                        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Archive className="h-3.5 w-3.5" />}
                        {t('adb.contact.archive')}
                      </button>
                    )}
                    {c.status !== 'new' && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void setStatus(c, 'new')}
                        className={`${actionBtn} bg-surface-soft text-ink-muted hover:bg-surface-container`}
                      >
                        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />}
                        {t('adb.contact.reopen')}
                      </button>
                    )}
                  </footer>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
