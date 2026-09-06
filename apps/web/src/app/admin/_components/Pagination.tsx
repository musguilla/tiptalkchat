'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatInt } from './format';

export interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  onPage: (page: number) => void;
  disabled?: boolean;
}

/** "Mostrando 1–25 de 120" + prev/next. */
export function Pagination({ page, limit, total, onPage, disabled = false }: PaginationProps) {
  const pages = Math.max(1, Math.ceil(total / Math.max(1, limit)));
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(total, page * limit);
  const canPrev = page > 1 && !disabled;
  const canNext = page < pages && !disabled;

  const btn =
    'btn-tactile inline-flex h-9 items-center gap-1 rounded-md border border-surface-container bg-white px-3 text-sm font-semibold text-ink transition hover:bg-surface-soft disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-ink-muted">
      <p>
        {total === 0 ? (
          'Sin resultados'
        ) : (
          <>
            Mostrando <span className="font-semibold text-ink">{formatInt(from)}</span>–
            <span className="font-semibold text-ink">{formatInt(to)}</span> de{' '}
            <span className="font-semibold text-ink">{formatInt(total)}</span>
          </>
        )}
      </p>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => onPage(page - 1)} disabled={!canPrev} className={btn}>
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </button>
        <span className="px-1 text-xs">
          Página {page} / {pages}
        </span>
        <button type="button" onClick={() => onPage(page + 1)} disabled={!canNext} className={btn}>
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
