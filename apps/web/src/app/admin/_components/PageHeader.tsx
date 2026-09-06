'use client';
import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

/** Page title + optional subtitle, with a right-side slot and a spinner while refreshing. */
export function PageHeader({
  title,
  subtitle,
  refreshing = false,
  children,
}: {
  title: string;
  subtitle?: string;
  refreshing?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="flex items-center gap-3 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          {title}
          {refreshing && <Loader2 className="h-4 w-4 animate-spin text-ink-soft" />}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-3">{children}</div>}
    </div>
  );
}
