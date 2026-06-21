'use client';
import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** 'danger' = red destructive action, 'primary' = brand primary, 'neutral' = ink. */
  tone?: 'danger' | 'primary' | 'neutral';
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Aceptar',
  cancelLabel = 'Cancelar',
  tone = 'primary',
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

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
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-vivid-strong">
        <div className="flex items-start gap-4">
          <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-md ${iconClasses}`}>
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-lg font-bold text-ink">{title}</h2>
            {description && (
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{description}</p>
            )}
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
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`btn-tactile rounded-md px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${confirmClasses}`}
          >
            {busy ? '…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
