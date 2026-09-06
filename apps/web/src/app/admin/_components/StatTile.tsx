'use client';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export type StatTone = 'default' | 'primary' | 'success' | 'warning' | 'danger';

export interface StatTileProps {
  label: string;
  value: string | number;
  sub?: string;
  href: string;
  tone?: StatTone;
  icon?: ReactNode;
}

const TONE_CLASSES: Record<StatTone, { icon: string; value: string }> = {
  default: { icon: 'bg-surface-soft text-ink-muted', value: 'text-ink' },
  primary: { icon: 'bg-primary-50 text-primary-500', value: 'text-primary-700' },
  success: { icon: 'bg-emerald-50 text-emerald-600', value: 'text-emerald-700' },
  warning: { icon: 'bg-amber-50 text-amber-600', value: 'text-amber-700' },
  danger: { icon: 'bg-red-50 text-red-500', value: 'text-red-700' },
};

/** Dashboard KPI card. Whole tile is a link to its section. */
export function StatTile({ label, value, sub, href, tone = 'default', icon }: StatTileProps) {
  const t = TONE_CLASSES[tone];
  return (
    <Link
      href={href}
      className="group relative flex flex-col justify-between gap-3 rounded-xl border border-surface-container bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-vivid sm:p-5"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">{label}</p>
        {icon ? (
          <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-md ${t.icon}`}>
            {icon}
          </span>
        ) : (
          <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-soft transition group-hover:text-primary-500" />
        )}
      </div>
      <div>
        <p className={`font-display text-3xl font-extrabold tracking-tight ${t.value}`}>{value}</p>
        {sub && <p className="mt-1 text-xs text-ink-muted">{sub}</p>}
      </div>
    </Link>
  );
}
