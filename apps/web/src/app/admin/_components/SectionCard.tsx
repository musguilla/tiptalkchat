'use client';
import type { ReactNode } from 'react';

export interface SectionCardProps {
  title: string;
  icon?: ReactNode;
  /** Right-side slot in the header (buttons, counters…). */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Remove inner padding — for tables that manage their own edges. */
  flush?: boolean;
}

/** White card with a titled header, used for every detail/list section. */
export function SectionCard({
  title,
  icon,
  action,
  children,
  className = '',
  flush = false,
}: SectionCardProps) {
  return (
    <section
      className={`overflow-hidden rounded-xl border border-surface-container bg-white shadow-soft ${className}`}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-container px-4 py-3 sm:px-5">
        <h2 className="flex items-center gap-2 font-display text-base font-extrabold tracking-tight text-ink">
          {icon && <span className="text-primary-500">{icon}</span>}
          {title}
        </h2>
        {action && <div className="flex items-center gap-2">{action}</div>}
      </header>
      <div className={flush ? '' : 'p-4 sm:p-5'}>{children}</div>
    </section>
  );
}
