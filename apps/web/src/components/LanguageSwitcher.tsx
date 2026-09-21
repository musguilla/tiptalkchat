'use client';
import { useEffect, useRef, useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { LOCALES, LOCALE_FLAGS, LOCALE_NAMES } from '@/i18n/config';
import { useLocale, useSwitchLocale } from '@/i18n/useLocale';

/** Dropdown to change the site language. */
export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const locale = useLocale();
  const switchTo = useSwitchLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('mousedown', onDown);
    return () => window.removeEventListener('mousedown', onDown);
  }, [open]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-full border border-surface-container bg-white px-3 py-1.5 text-sm font-medium text-ink transition hover:bg-surface-soft"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe className="h-4 w-4 text-ink-muted" />
        <span>{LOCALE_FLAGS[locale]}</span>
        <span className="hidden sm:inline">{LOCALE_NAMES[locale]}</span>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute top-full right-0 z-50 mt-2 grid w-[24rem] max-w-[92vw] grid-cols-2 gap-0.5 rounded-xl border border-surface-container bg-white p-1.5 shadow-vivid-strong"
        >
          {LOCALES.map((l) => (
            <button
              key={l}
              type="button"
              role="option"
              aria-selected={l === locale}
              onClick={() => {
                setOpen(false);
                if (l !== locale) switchTo(l);
              }}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-sm transition hover:bg-surface-soft ${
                l === locale ? 'font-semibold text-primary-600' : 'text-ink'
              }`}
            >
              <span className="text-base">{LOCALE_FLAGS[l]}</span>
              <span className="flex-1">{LOCALE_NAMES[l]}</span>
              {l === locale && <Check className="h-4 w-4 text-primary-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
