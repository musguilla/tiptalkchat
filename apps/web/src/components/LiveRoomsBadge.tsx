'use client';
import { useEffect, useState } from 'react';
import { useT } from '@/i18n/useLocale';

const BASE = 45352;
const MIN = 44000;
const MAX = 47500;
const TICK_MS = 60_000;

/**
 * Decorative live-counter for the social-proof strip. Seeds at ~45.352
 * and walks by small deltas every minute so the number looks alive without
 * spiking. Pure client-side noise — not backed by real metrics.
 *
 * The deltas come from a hash of (minute-of-day, day-of-month) so all
 * clients converge on the same value when they refresh, avoiding the
 * embarrassment of two browsers showing wildly different "live" counts.
 */
function pseudoNoiseAt(minute: number): number {
  // Cheap deterministic hash → range [-6, +12] biased upward.
  let h = (minute * 2654435761) >>> 0;
  h ^= h >>> 13;
  h = (h * 1597334677) >>> 0;
  const sample = (h >>> 0) % 19; // 0..18
  return sample - 6; // -6..+12
}

function computeCount(date: Date): number {
  // Walk from a fixed epoch so values are stable across reloads.
  const epoch = Date.UTC(2026, 5, 1) / 60_000; // minutes since 2026-06-01 UTC
  const minutes = Math.floor(date.getTime() / 60_000) - epoch;
  let n = BASE;
  for (let i = Math.max(0, minutes - 240); i <= minutes; i += 1) {
    n += pseudoNoiseAt(i);
  }
  return Math.min(MAX, Math.max(MIN, n));
}

export function LiveRoomsBadge() {
  const t = useT();
  const [count, setCount] = useState<number>(BASE);

  useEffect(() => {
    const tick = (): void => setCount(computeCount(new Date()));
    tick();
    const id = window.setInterval(tick, TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  const formatted = new Intl.NumberFormat('es-ES').format(count);

  return (
    <div className="flex items-center gap-3">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
      </span>
      <div>
        <p className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          {formatted}
        </p>
        <p className="text-sm text-ink-muted">{t('home.live.label')}</p>
      </div>
    </div>
  );
}
