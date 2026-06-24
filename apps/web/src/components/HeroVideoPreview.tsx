import { DollarSign, Unlock } from 'lucide-react';

/**
 * Decorative video-session mockup that anchors the hero. The subject image
 * lives at /public/hero-room.jpg — replace that file to change the hero
 * subject. Overlays (LIVE pulse, balance, UNLOCKED) are pure CSS.
 */
export function HeroVideoPreview() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* Video card */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gradient-to-br from-[#3a1408] via-[#1f0a04] to-[#0c0503] shadow-vivid-strong">
        {/* Hero subject image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-room.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-90"
        />
        {/* Top fade for legibility of LIVE pill */}
        <div className="absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-black/70 to-transparent" />
        {/* Bottom fade for legibility of stats */}
        <div className="absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-black/70 to-transparent" />

        {/* Top-left LIVE pill */}
        <div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-md bg-black/40 px-3 py-1.5 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary-500" />
          </span>
          <span className="label-mono text-white/90">LIVE: SESIÓN PRIVADA</span>
        </div>

        {/* Bottom stats */}
        <div className="absolute inset-x-4 bottom-4 z-20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 rounded-md bg-black/40 px-3 py-1.5 backdrop-blur-sm">
            <DollarSign className="h-3.5 w-3.5 text-primary-300" />
            <span className="label-mono text-white">$5.50</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-black/40 px-3 py-1.5 backdrop-blur-sm">
            <Unlock className="h-3.5 w-3.5 text-secondary-300" />
            <span className="label-mono text-white">UNLOCKED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
