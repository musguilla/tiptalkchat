import { t } from '@/i18n';
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/i18n/config';

// Maps the exact error string the API returns to a translation key.
const MESSAGE_TO_KEY: Record<string, string> = {
  'Sesión caducada. Vuelve a iniciar sesión.': 'err.s401',
  'No tienes permisos para esta acción.': 'err.s403',
  'No encontrado.': 'err.s404',
  'Conflicto: el estado ya ha cambiado.': 'err.s409',
  'Error desconocido': 'err.unknown',
  'AGE_VERIFICATION_REQUIRED': 'err.00',
  'Admin only': 'err.01',
  'Authentication required': 'err.02',
  'Avatar no encontrado': 'err.03',
  'Cannot tip a guest message': 'err.04',
  'Cannot tip ownerless media': 'err.05',
  'Cannot tip yourself': 'err.06',
  'Contact message not found': 'err.07',
  'Email already registered': 'err.08',
  'Ese email ya está en uso': 'err.09',
  'Esta cuenta ha sido bloqueada. Contacta con soporte.': 'err.10',
  'Foto no encontrada': 'err.11',
  'Fuente de media no válida': 'err.12',
  'Guest session not found': 'err.13',
  'Guest token does not match room': 'err.14',
  'Invalid JSON': 'err.15',
  'Invalid Mux signature': 'err.16',
  'Invalid PIN': 'err.17',
  'Invalid credentials': 'err.18',
  'Invalid guest token': 'err.19',
  'Invalid slug': 'err.20',
  'LiveKit no está configurado como SFU.': 'err.21',
  'Media no encontrada': 'err.22',
  'Media not found': 'err.23',
  'No fields to update': 'err.24',
  'No hay cuenta de cobros conectada': 'err.25',
  'No hay ninguna grabación activa en esta sala': 'err.26',
  'No puedes eliminar tu propia cuenta de administrador': 'err.27',
  'No puedes enviarte un mensaje a ti mismo': 'err.28',
  'No puedes seguirte a ti mismo': 'err.29',
  'Not a member of this room': 'err.30',
  'Not your media': 'err.31',
  'Only a guest session can be upgraded': 'err.32',
  'Only the creator can close this room': 'err.33',
  'PIN required': 'err.34',
  'Payout is no longer pending': 'err.35',
  'Payout not found': 'err.36',
  'Photo not found': 'err.37',
  'Room has expired': 'err.38',
  'Room is closed': 'err.39',
  'Room not found': 'err.40',
  'Sala no encontrada': 'err.41',
  'Session expired — please log in again': 'err.42',
  'Target media not found': 'err.43',
  'Target message not found': 'err.44',
  'Target room not found': 'err.45',
  'Target/room mismatch': 'err.46',
  'Top-up is for guest sessions; users should use /purchases': 'err.47',
  'Tu cuenta ya está verificada': 'err.48',
  'User not found': 'err.49',
  'Usuario no encontrado': 'err.50',
  'Verificación no encontrada': 'err.51',
  'You are muted in this room': 'err.52',
  'You cannot block another admin': 'err.53',
  'You cannot block yourself': 'err.54',
  'You cannot change your own role': 'err.55',
};

function browserLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  const seg = window.location.pathname.split('/')[1] ?? '';
  return isLocale(seg) ? seg : DEFAULT_LOCALE;
}

/** Translate a raw API error message into the current locale (falls back to the raw text). */
export function localizeApiMessage(raw: string | undefined | null): string {
  if (!raw) return '';
  const key = MESSAGE_TO_KEY[raw];
  if (!key) return raw;
  return t(browserLocale(), key);
}
