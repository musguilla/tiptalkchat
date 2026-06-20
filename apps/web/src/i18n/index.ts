export type Locale = 'es' | 'en';
export const DEFAULT_LOCALE: Locale = 'es';

const dict = {
  es: {
    'landing.title': 'TipTalk — chats privados con propinas',
    'landing.subtitle': 'Crea una sala, comparte el enlace y recibe propinas en Tipsys.',
    'landing.cta.create': 'Crear sala',
    'landing.cta.join': 'Unirme a una sala',
    'create.name': 'Nombre de la sala',
    'create.submit': 'Crear sala',
    'chat.send': 'Enviar',
    'chat.placeholder': 'Escribe un mensaje…',
    'wallet.title': 'Tu monedero',
    'wallet.balance': 'Saldo',
    'wallet.buy': 'Comprar Tipsys',
    'wallet.payout.request': 'Solicitar cobro',
    'wallet.payout.min': 'Mínimo {min} Tipsys',
    'tip.send': 'Enviar Tipsy',
    'auth.login': 'Iniciar sesión',
    'auth.signup': 'Crear cuenta',
    'auth.email': 'Email',
    'auth.password': 'Contraseña',
    'auth.displayName': 'Tu nombre',
  },
  en: {
    'landing.title': 'TipTalk — private rooms with tipping',
    'landing.subtitle': 'Create a room, share the link, get tipped in Tipsys.',
    'landing.cta.create': 'Create room',
    'landing.cta.join': 'Join a room',
    'create.name': 'Room name',
    'create.submit': 'Create room',
    'chat.send': 'Send',
    'chat.placeholder': 'Type a message…',
    'wallet.title': 'Your wallet',
    'wallet.balance': 'Balance',
    'wallet.buy': 'Buy Tipsys',
    'wallet.payout.request': 'Request payout',
    'wallet.payout.min': 'Minimum {min} Tipsys',
    'tip.send': 'Send Tipsy',
    'auth.login': 'Sign in',
    'auth.signup': 'Sign up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.displayName': 'Your name',
  },
} as const;

type Key = keyof (typeof dict)['es'];

export function t(locale: Locale, key: Key, vars: Record<string, string | number> = {}): string {
  const raw = dict[locale][key] ?? dict[DEFAULT_LOCALE][key] ?? key;
  return Object.entries(vars).reduce<string>(
    (acc, [k, v]) => acc.replace(`{${k}}`, String(v)),
    raw,
  );
}
