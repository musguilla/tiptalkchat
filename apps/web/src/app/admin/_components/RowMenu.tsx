'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { MoreVertical } from 'lucide-react';

export interface RowMenuItem {
  key: string;
  label: string;
  icon?: ReactNode;
  tone?: 'default' | 'danger';
  onClick: () => void;
  disabled?: boolean;
}

/**
 * Kebab (3-dots) actions menu for a table row. The dropdown is rendered
 * position:fixed anchored to the button, so it isn't clipped by the table's
 * overflow. Closes on outside click, Escape, scroll or resize.
 */
export function RowMenu({ items, label = 'Acciones' }: { items: RowMenuItem[]; label?: string }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const close = (): void => setOpen(false);
    const onDown = (e: MouseEvent): void => {
      if (
        menuRef.current?.contains(e.target as Node) ||
        btnRef.current?.contains(e.target as Node)
      )
        return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [open]);

  function toggle(e: React.MouseEvent): void {
    e.stopPropagation();
    if (open) {
      setOpen(false);
      return;
    }
    const r = btnRef.current?.getBoundingClientRect();
    if (r) setPos({ top: r.bottom + 4, right: window.innerWidth - r.right });
    setOpen(true);
  }

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        className="grid h-8 w-8 place-items-center rounded-md text-ink-muted transition hover:bg-surface-soft hover:text-ink"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open && pos && (
        <div
          ref={menuRef}
          role="menu"
          style={{ position: 'fixed', top: pos.top, right: pos.right, zIndex: 60 }}
          className="min-w-[190px] overflow-hidden rounded-xl border border-surface-container bg-white py-1 shadow-vivid-strong"
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((it) => (
            <button
              key={it.key}
              type="button"
              role="menuitem"
              disabled={it.disabled}
              onClick={() => {
                setOpen(false);
                it.onClick();
              }}
              className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium transition disabled:opacity-40 ${
                it.tone === 'danger'
                  ? 'text-red-600 hover:bg-red-50'
                  : 'text-ink hover:bg-surface-soft'
              }`}
            >
              {it.icon}
              {it.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
