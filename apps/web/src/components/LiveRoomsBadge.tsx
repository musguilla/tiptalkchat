'use client';
import { useEffect, useRef, useState } from 'react';
import { useT, useLocale } from '@/i18n/useLocale';
import { INTL_TAG } from '@/i18n/config';

const BASE = 46000;
const MIN = 44800;
const MAX = 47600;

/**
 * Decorative "active rooms" live-counter for the social-proof strip.
 * It random-walks by ±1 at irregular ~1–4.5s intervals so it feels like a
 * real, breathing metric, with a mild pull toward a center that drifts over
 * the day (busier in the evening, quieter at dawn). Pure client-side — not a
 * real metric.
 */
function centerAt(date: Date): number {
  const hour = date.getHours() + date.getMinutes() / 60;
  // Daily activity wave: trough ~5h, peak ~21h.
  const wave = Math.sin(((hour - 5) / 24) * 2 * Math.PI);
  return Math.round(BASE + wave * 850);
}

export function LiveRoomsBadge() {
  const t = useT();
  const locale = useLocale();
  const [count, setCount] = useState<number>(BASE);
  const currentRef = useRef<number>(BASE);

  useEffect(() => {
    // Seed near today's center with a small random offset.
    currentRef.current = centerAt(new Date()) + (Math.floor(Math.random() * 41) - 20);
    setCount(currentRef.current);

    let timer: number;
    const step = (): void => {
      const center = centerAt(new Date());
      const diff = center - currentRef.current;
      // Bias the coin toward the center (mean reversion), capped so it never
      // marches in a straight line.
      const bias = Math.max(-0.32, Math.min(0.32, diff / 220));
      const r = Math.random();
      let delta = 0;
      if (r < 0.82) {
        // 82% of ticks move by exactly one; the rest are natural pauses.
        delta = Math.random() < 0.5 + bias ? 1 : -1;
      }
      currentRef.current = Math.min(MAX, Math.max(MIN, currentRef.current + delta));
      setCount(currentRef.current);
      timer = window.setTimeout(step, 1200 + Math.random() * 3300);
    };
    timer = window.setTimeout(step, 1200 + Math.random() * 2000);
    return () => window.clearTimeout(timer);
  }, []);

  const formatted = new Intl.NumberFormat(INTL_TAG[locale]).format(count);

  return (
    <div className="flex items-center gap-3">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
      </span>
      <div>
        <p className="font-display text-2xl font-extrabold tracking-tight text-ink tabular-nums sm:text-3xl">
          {formatted}
        </p>
        <p className="text-sm text-ink-muted">{t('home.live.label')}</p>
      </div>
    </div>
  );
}
