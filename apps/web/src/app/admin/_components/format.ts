import { formatTipsysAsEur } from '@tiptalk/economy';
import { ApiError } from '@/lib/api';

/** "1.234 Tipsys" (Spanish thousands separator). */
export function formatTipsys(tipsys: number): string {
  return `${new Intl.NumberFormat('es-ES').format(tipsys)} Tipsys`;
}

/**
 * Tipsys → "12,50 €" via the economy package. `formatTipsysAsEur` throws on
 * negative / non-integer input, so ledger amounts (signed) go through here.
 */
export function tipsysToEur(tipsys: number): string {
  const abs = Math.abs(Math.trunc(tipsys));
  try {
    const s = formatTipsysAsEur(abs);
    return tipsys < 0 ? `-${s}` : s;
  } catch {
    return '—';
  }
}

/** Euro cents → "12,50 €". */
export function formatEurCents(cents: number): string {
  return `${(cents / 100).toFixed(2).replace('.', ',')} €`;
}

/** ISO → "6/9/2026, 12:34:56" (es-ES). Nullish → em dash. */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString('es-ES');
}

/** ISO → "6/9/2026" (date only). */
export function formatDateShort(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('es-ES');
}

export function formatInt(n: number): string {
  return new Intl.NumberFormat('es-ES').format(n);
}

/** Human-readable message out of anything `api()` can throw. */
export function describeApiError(err: unknown): string {
  if (err instanceof ApiError) {
    const p = err.payload;
    if (p && typeof p === 'object' && 'message' in p) {
      const msg = (p as { message: unknown }).message;
      if (typeof msg === 'string' && msg.trim()) return msg;
    }
    if (err.status === 401) return 'Sesión caducada. Vuelve a iniciar sesión.';
    if (err.status === 403) return 'No tienes permisos para esta acción.';
    if (err.status === 404) return 'No encontrado.';
    if (err.status === 409) return 'Conflicto: el estado ya ha cambiado.';
    return `Error ${err.status}`;
  }
  if (err instanceof Error && err.message) return err.message;
  return 'Error desconocido';
}

export function ledgerKindLabel(kind: string): string {
  switch (kind) {
    case 'PURCHASE_CREDIT':
      return 'Compra de Tipsys';
    case 'TIP_SENT':
      return 'Propina enviada';
    case 'TIP_RECEIVED':
      return 'Propina recibida';
    case 'PAYOUT_DEBIT':
      return 'Cobro solicitado';
    case 'PAYOUT_REFUND':
      return 'Devolución de cobro';
    case 'ADJUSTMENT':
      return 'Ajuste manual';
    default:
      return kind;
  }
}

export function payoutStatusLabel(status: string): string {
  switch (status) {
    case 'requested':
      return 'Solicitado';
    case 'in_review':
      return 'En revisión';
    case 'paid':
      return 'Pagado';
    case 'failed':
      return 'Fallido';
    case 'refunded':
      return 'Reembolsado';
    default:
      return status;
  }
}
