import { User, DollarSign, Unlock, Coins } from 'lucide-react';

/**
 * Decorative video-session mockup that anchors the hero. Pure CSS / SVG —
 * no external assets needed. Swap the centre face block for a real product
 * screenshot once you have one to plug in.
 */
export function HeroVideoPreview() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* Floating "Nueva propina" notification */}
      <div className="absolute -bottom-6 -left-4 z-10 flex items-center gap-3 rounded-md border border-surface-container bg-white p-3 shadow-vivid sm:-left-12">
        <div className="grid h-9 w-9 place-items-center rounded-md bg-secondary-500 text-white">
          <Coins className="h-5 w-5" />
        </div>
        <div>
          <p className="label-mono text-secondary-500">Nueva propina</p>
          <p className="font-display text-sm font-bold text-ink">$50.00 recibidos</p>
        </div>
      </div>

      {/* Video card */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gradient-to-br from-[#3a1408] via-[#1f0a04] to-[#0c0503] shadow-vivid-strong">
        {/* Top-left LIVE pill */}
        <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-md bg-black/40 px-3 py-1.5 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary-500" />
          </span>
          <span className="label-mono text-white/90">LIVE: SESIÓN PRIVADA</span>
        </div>

        {/* Decorative subject silhouette */}
        <div className="absolute inset-0 grid place-items-center">
          <div className="relative">
            <div className="absolute -inset-20 rounded-full bg-[radial-gradient(closest-side,rgba(255,92,0,0.45),transparent_70%)]" />
            <div className="relative grid h-44 w-44 place-items-center rounded-full bg-gradient-to-br from-[#ff8c5f] to-[#a73a00] text-white shadow-2xl">
              <User className="h-20 w-20" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Bottom stats */}
        <div className="absolute inset-x-4 bottom-4 z-10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 rounded-md bg-black/40 px-3 py-1.5 backdrop-blur-sm">
            <DollarSign className="h-3.5 w-3.5 text-primary-300" />
            <span className="label-mono text-white">$0.00</span>
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
