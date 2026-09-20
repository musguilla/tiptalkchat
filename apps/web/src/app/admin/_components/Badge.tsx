'use client';
import type { ReactNode } from 'react';
import { useT } from '@/i18n/useLocale';
import { payoutStatusLabel } from './format';
import type { ContactStatus, PayoutStatus } from './types';

export type BadgeTone = 'neutral' | 'success' | 'danger' | 'warning' | 'info';

const PAYOUT_TONES: Record<PayoutStatus, BadgeTone> = {
  requested: 'warning',
  in_review: 'info',
  paid: 'success',
  failed: 'danger',
  refunded: 'neutral',
};

const CONTACT_TONES: Record<ContactStatus, BadgeTone> = {
  new: 'warning',
  read: 'info',
  archived: 'neutral',
};

const CONTACT_KEYS: Record<ContactStatus, string> = {
  new: 'adb.contact.status.new',
  read: 'adb.contact.status.read',
  archived: 'adb.contact.status.archived',
};

export function PayoutStatusBadge({ status }: { status: PayoutStatus }) {
  return <Badge tone={PAYOUT_TONES[status] ?? 'neutral'}>{payoutStatusLabel(status)}</Badge>;
}

export function ContactStatusBadge({ status }: { status: ContactStatus }) {
  const t = useT();
  const tone = CONTACT_TONES[status] ?? 'warning';
  return <Badge tone={tone}>{t(CONTACT_KEYS[status] ?? CONTACT_KEYS.new)}</Badge>;
}

const TONES: Record<BadgeTone, string> = {
  neutral: 'bg-surface-soft text-ink-muted ring-surface-container',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  danger: 'bg-red-50 text-red-700 ring-red-200',
  warning: 'bg-amber-50 text-amber-700 ring-amber-200',
  info: 'bg-sky-50 text-sky-700 ring-sky-200',
};

export function Badge({
  tone = 'neutral',
  children,
  className = '',
}: {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
