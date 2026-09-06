'use client';
import type { UserRole } from './types';

const ROLE_STYLES: Record<UserRole, string> = {
  admin: 'bg-secondary-50 text-secondary-700 ring-secondary-200',
  mod: 'bg-primary-50 text-primary-700 ring-primary-200',
  user: 'bg-surface-soft text-ink-muted ring-surface-container',
};

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Admin',
  mod: 'Mod',
  user: 'Usuario',
};

function isRole(value: string): value is UserRole {
  return value === 'admin' || value === 'mod' || value === 'user';
}

/** Small pill showing the account role. Unknown roles fall back to neutral. */
export function RolePill({ role, className = '' }: { role: string; className?: string }) {
  const key: UserRole = isRole(role) ? role : 'user';
  const label = isRole(role) ? ROLE_LABELS[key] : role;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset ${ROLE_STYLES[key]} ${className}`}
    >
      {label}
    </span>
  );
}
