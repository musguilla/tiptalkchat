'use client';
import type { ReactNode } from 'react';
import { AlertTriangle, Inbox, RefreshCw } from 'lucide-react';

/** Red banner for fetch/action errors. */
export function ErrorBanner({
  message,
  onRetry,
  className = '',
}: {
  message: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={`flex flex-wrap items-center justify-between gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 ${className}`}
    >
      <span className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        {message}
      </span>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="btn-tactile inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-red-700 shadow-soft transition hover:bg-red-100"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Reintentar
        </button>
      )}
    </div>
  );
}

/** Dashed placeholder for empty lists. */
export function EmptyState({
  icon,
  title,
  hint,
  className = '',
}: {
  icon?: ReactNode;
  title: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div
      className={`grid place-items-center rounded-xl border border-dashed border-surface-container bg-white px-6 py-12 text-center ${className}`}
    >
      <div className="grid h-12 w-12 place-items-center rounded-full bg-primary-50 text-primary-500">
        {icon ?? <Inbox className="h-6 w-6" />}
      </div>
      <p className="mt-3 text-sm font-semibold text-ink">{title}</p>
      {hint && <p className="mt-1 max-w-sm text-xs text-ink-muted">{hint}</p>}
    </div>
  );
}

/** Grey shimmer rows while a table loads. */
export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="animate-pulse divide-y divide-surface-container">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 px-4 py-3.5">
          {Array.from({ length: cols }).map((__, c) => (
            <div
              key={c}
              className="h-3.5 rounded-full bg-surface-container"
              style={{ width: c === 0 ? '28%' : `${10 + ((r + c) % 3) * 4}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Grid of blank cards while a card list loads. */
export function CardSkeleton({ count = 4, className = '' }: { count?: number; className?: string }) {
  return (
    <div className={`grid animate-pulse gap-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-28 rounded-xl border border-surface-container bg-white" />
      ))}
    </div>
  );
}
