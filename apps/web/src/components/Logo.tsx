/**
 * TipTalk wordmark. Currently rendered as HTML text with the brand colors
 * (orange "tiptalk" + pink ".chat") so it scales with text-size classes
 * and adapts to dark mode automatically. Swap the implementation for
 * <img src="/logo.svg"> once the SVG file is added to public/.
 */
export function Logo({ className = 'text-2xl' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-baseline font-black tracking-tight leading-none ${className}`}
      aria-label="tiptalk.chat"
    >
      <span className="text-orange-500">tiptalk</span>
      <span className="text-pink-500">.chat</span>
    </span>
  );
}
