'use client';
import { useEffect, type ReactNode } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

export interface InlineModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'danger' | 'primary' | 'neutral';
  busy?: boolean;
  /** Disable the confirm button (e.g. required field empty). */
  confirmDisabled?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  /** Form controls rendered under the description. */
  children: ReactNode;
}

/**
 * Same look as `ConfirmDialog` but with a children slot, for confirmations
 * that need an input (payout reject reason, Stripe transfer id…).
 */
export function InlineModal({
  open,
  title,
  description,
  confirmLabel = 'Aceptar',
  cancelLabel = 'Cancelar',
  tone = 'primary',
  busy = false,
  confirmDisabled = false,
  onConfirm,
  onCancel,
  children,
}: InlineModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy) onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, busy, onCancel]);

  if (!open) return null;

  const confirmClasses =
    tone === 'danger'
      ? 'bg-red-500 hover:bg-red-600 text-white shadow-soft'
      : tone === 'neutral'
        ? 'bg-ink hover:bg-ink/90 text-white'
        : 'bg-primary-500 hover:bg-primary-600 text-white shadow-vivid';

  const iconClasses =
    tone === 'danger'
      ? 'bg-red-50 text-red-500'
      : tone === 'neutral'
        ? 'bg-surface-container text-ink'
        : 'bg-primary-50 text-primary-500';

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-ink/40 p-4 backdrop-blur-sm">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!busy && !confirmDisabled) onConfirm();
        }}
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-vivid-strong"
      >
        <div className="flex items-start gap-4">
          <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-md ${iconClasses}`}>
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-lg font-bold text-ink">{title}</h2>
            {description && (
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{description}</p>
            )}
            <div className="mt-4 space-y-3">{children}</div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="btn-tactile rounded-md bg-surface-container px-4 py-2 text-sm font-semibold text-ink transition hover:bg-surface-high disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="submit"
            disabled={busy || confirmDisabled}
            className={`btn-tactile inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${confirmClasses}`}
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
