/**
 * TipTalk wordmark in Vivid Pulse Light brand colors:
 *   tiptalk  → primary-500 (#FF5C00)
 *   .chat    → secondary-500 (#FF007A)
 *
 * Uses Plus Jakarta Sans (font-display) Extra Bold for the geometric brand
 * feel. Swap the implementation for <img src="/logo.svg"> once the official
 * SVG is added to apps/web/public/.
 */
export function Logo({ className = 'text-2xl' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-baseline font-display font-extrabold tracking-tight leading-none ${className}`}
      aria-label="tiptalk.chat"
    >
      <span className="text-primary-500">tiptalk</span>
      <span className="text-secondary-500">.chat</span>
    </span>
  );
}
