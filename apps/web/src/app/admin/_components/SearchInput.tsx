'use client';
import { useEffect, useRef, useState } from 'react';
import { Search, X as XIcon } from 'lucide-react';

/**
 * Controlled locally, committed to the parent after a 300 ms pause. `initial`
 * is the value currently in the URL — the effect skips committing when the
 * trimmed input already matches it (avoids a replace loop after commit).
 */
export function SearchInput({
  initial,
  onCommit,
  placeholder = 'Buscar…',
  className = '',
}: {
  initial: string;
  onCommit: (q: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [value, setValue] = useState(initial);
  const commitRef = useRef(onCommit);
  commitRef.current = onCommit;

  useEffect(() => {
    const trimmed = value.trim();
    if (trimmed === initial) return;
    const id = window.setTimeout(() => commitRef.current(trimmed), 300);
    return () => window.clearTimeout(id);
  }, [value, initial]);

  return (
    <label className={`relative block ${className}`}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-full border border-surface-container bg-white pl-9 pr-9 text-sm text-ink shadow-soft outline-none transition placeholder:text-ink-soft focus:border-primary-500"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue('')}
          aria-label="Limpiar búsqueda"
          className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-ink-soft transition hover:bg-surface-soft hover:text-ink"
        >
          <XIcon className="h-3.5 w-3.5" />
        </button>
      )}
    </label>
  );
}
