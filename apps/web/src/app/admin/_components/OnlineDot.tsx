'use client';
import { useT } from '@/i18n/useLocale';

export interface OnlineDotProps {
  online: boolean;
  /** Optional text next to the dot (e.g. "Conectado ahora"). */
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

/** Green pulsing dot when online, grey when offline. */
export function OnlineDot({ online, label, size = 'sm', className = '' }: OnlineDotProps) {
  const t = useT();
  const dim = size === 'md' ? 'h-3 w-3' : 'h-2.5 w-2.5';
  const stateLabel = online ? t('adb.online.on') : t('adb.online.off');
  return (
    <span
      className={`inline-flex items-center gap-1.5 ${className}`}
      title={label ?? stateLabel}
    >
      <span className={`relative inline-flex ${dim}`} aria-hidden>
        {online && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        )}
        <span
          className={`relative inline-flex ${dim} rounded-full ${
            online ? 'bg-emerald-500' : 'bg-ink-soft/40'
          }`}
        />
      </span>
      {label && (
        <span className={`text-xs font-medium ${online ? 'text-emerald-700' : 'text-ink-muted'}`}>
          {label}
        </span>
      )}
      {!label && <span className="sr-only">{stateLabel}</span>}
    </span>
  );
}
