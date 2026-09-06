'use client';

export interface TabItem<K extends string> {
  key: K;
  label: string;
  count?: number;
}

export function Tabs<K extends string>({
  items,
  value,
  onChange,
}: {
  items: ReadonlyArray<TabItem<K>>;
  value: K;
  onChange: (key: K) => void;
}) {
  return (
    <div
      role="tablist"
      className="inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-surface-container bg-white p-1 shadow-soft"
    >
      {items.map((item) => {
        const active = item.key === value;
        return (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.key)}
            className={`btn-tactile inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
              active
                ? 'bg-primary-50 text-primary-700'
                : 'text-ink-muted hover:bg-surface-soft hover:text-ink'
            }`}
          >
            {item.label}
            {typeof item.count === 'number' && (
              <span
                className={`rounded-full px-1.5 text-[10px] font-bold ${
                  active ? 'bg-primary-500 text-white' : 'bg-surface-container text-ink-muted'
                }`}
              >
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
