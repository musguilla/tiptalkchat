'use client';
import type { MouseEvent, ReactNode } from 'react';

/** Horizontal-scroll wrapper + base table. Children: <thead>/<tbody>. */
export function TableShell({ children, minWidth = 'min-w-[640px]' }: { children: ReactNode; minWidth?: string }) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full ${minWidth} border-collapse text-sm`}>{children}</table>
    </div>
  );
}

export function TableHead({ children }: { children: ReactNode }) {
  return (
    <thead className="sticky top-0 z-10 bg-surface-soft text-left text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
      <tr>{children}</tr>
    </thead>
  );
}

export function Th({
  children,
  align = 'left',
  className = '',
}: {
  children?: ReactNode;
  align?: 'left' | 'right' | 'center';
  className?: string;
}) {
  const a = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';
  return <th className={`whitespace-nowrap px-4 py-2.5 font-semibold ${a} ${className}`}>{children}</th>;
}

export function Td({
  children,
  align = 'left',
  className = '',
}: {
  children?: ReactNode;
  align?: 'left' | 'right' | 'center';
  className?: string;
}) {
  const a = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';
  return <td className={`px-4 py-3 align-middle ${a} ${className}`}>{children}</td>;
}

/** Zebra row with hover highlight; becomes clickable when `onClick` is set. */
export function Tr({
  index,
  onClick,
  children,
  className = '',
}: {
  index: number;
  onClick?: (e: MouseEvent<HTMLTableRowElement>) => void;
  children: ReactNode;
  className?: string;
}) {
  const zebra = index % 2 === 1 ? 'bg-surface-soft/40' : 'bg-white';
  const interactive = onClick ? 'cursor-pointer hover:bg-primary-50/70' : 'hover:bg-surface-soft/70';
  return (
    <tr
      onClick={onClick}
      className={`border-t border-surface-container transition ${zebra} ${interactive} ${className}`}
    >
      {children}
    </tr>
  );
}
