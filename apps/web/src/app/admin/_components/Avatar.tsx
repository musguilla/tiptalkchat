'use client';

const SIZES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-24 w-24 text-4xl sm:h-28 sm:w-28',
} as const;

export function Avatar({
  url,
  name,
  size = 'sm',
  className = '',
}: {
  url: string | null | undefined;
  name: string;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const dim = SIZES[size];
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt=""
        className={`${dim} shrink-0 rounded-full bg-surface-soft object-cover ${className}`}
      />
    );
  }
  return (
    <span
      className={`grid ${dim} shrink-0 place-items-center rounded-full bg-primary-500 font-display font-bold text-white ${className}`}
      aria-hidden
    >
      {name[0]?.toUpperCase() ?? '?'}
    </span>
  );
}
