import type { MessageKey } from './es';

export const pl: { [K in MessageKey]?: string } = {
  // --- Common ---
  'common.loading': 'Ładowanie…',
  'common.save': 'Zapisz',
  'common.cancel': 'Anuluj',
  'common.close': 'Zamknij',
  'common.retry': 'Spróbuj ponownie',
  'common.back': 'Wróć',
  'common.backHome': 'Powrót na stronę główną',
  'common.send': 'Wyślij',
  'common.online': 'Teraz online',
  'common.offline': 'Offline',
  'common.online.short': 'Online',

  // --- Header / nav ---
  'nav.createChat': 'Utwórz czat',
  'nav.howItWorks': 'Jak to działa',
  'nav.features': 'Funkcje',
  'nav.wallet': 'Portfel',
  'nav.login': 'Zaloguj się',
  'nav.logout': 'Wyloguj się',
  'nav.messages': 'Wiadomości',

  // --- Footer ---
  'footer.tagline': 'Prywatne pokoje czatu z napiwkami.',
  'footer.col.platform': 'Platforma',
  'footer.col.legal': 'Informacje prawne',
  'footer.col.support': 'Pomoc',
  'footer.link.createChat': 'Utwórz czat',
  'footer.link.howItWorks': 'Jak to działa',
  'footer.link.features': 'Funkcje',
  'footer.link.terms': 'Warunki korzystania',
  'footer.link.privacy': 'Polityka prywatności',
  'footer.link.creators': 'Poradnik dla twórców',
  'footer.link.contact': 'Kontakt',
  'footer.rights': 'Wszelkie prawa zastrzeżone.',
  'footer.madeWith': 'Zrobione z ❤ dla twórców',

  // --- Home / landing ---
  'home.hero.title': 'Prywatne pokoje czatu 1 na 1',
  'home.hero.subtitle': 'Rozmawiaj z kim chcesz przez wideorozmowę, głos lub sam tekst.',
  'home.hero.cta': 'Utwórz pokój czatu',
  'home.hero.live': 'LIVE: PRYWATNA SESJA',
  'home.discover.title': 'Poznaj nowych znajomych',
  'home.discover.subtitle': 'Obserwuj ich lub wyślij wiadomość, żeby porozmawiać.',
  'home.discover.message': 'Wiadomość',
  'home.finalCta.cta': 'Utwórz pokój czatu',

  // --- Auth ---
  'auth.login': 'Zaloguj się',
  'auth.signup': 'Załóż konto',
  'auth.email': 'E-mail',
  'auth.password': 'Hasło',
  'auth.displayName': 'Twoje imię',
  'auth.haveAccount': 'Masz już konto?',
  'auth.noAccount': 'Nie masz konta?',

  // --- Profile ---
  'profile.follow': 'Obserwuj',
  'profile.following': 'Obserwujesz',
  'profile.message': 'Wiadomość',
  'profile.messageCta': 'Wyślij wiadomość, żeby porozmawiać',
  'profile.followers': 'obserwujących',
  'profile.followingCount': 'obserwowanych',
  'profile.editProfile': 'Edytuj profil',
  'profile.memberSince': 'W tiptalk.chat od {date}',
  'profile.gallery': 'Galeria',
  'profile.privatePhoto': 'Prywatne zdjęcie',
  'profile.notFound.title': 'Nie znaleziono profilu',
  'profile.notFound.body': 'Ten użytkownik nie istnieje lub nie jest już dostępny.',

  // --- Messages / composer ---
  'msg.composer.title': 'Wiadomość do',
  'msg.composer.label': 'Twoja wiadomość',
  'msg.composer.placeholder': 'Napisz do {name}, żeby zacząć rozmowę…',
  'msg.composer.send': 'Wyślij wiadomość',
  'msg.composer.sent.title': 'Wiadomość wysłana!',
  'msg.composer.sent.body': '{name} otrzyma powiadomienie e-mail, żeby wejść i ci odpowiedzieć.',
  'msg.inbox.title': 'Wiadomości',
  'msg.inbox.empty': 'Jeszcze brak wiadomości',
  'msg.inbox.reply': 'Napisz odpowiedź…',

  // --- Wallet ---
  'wallet.title': 'Portfel',
  'wallet.balance': 'Saldo',
  'wallet.buy': 'Kup Tipsys',
  'wallet.payout.request': 'Poproś o wypłatę',
  'wallet.activate': 'Aktywuj wypłaty',

  // --- Room / chat ---
  'chat.send': 'Wyślij',
  'chat.placeholder': 'Napisz wiadomość…',
  'chat.guestCta.q': 'Podoba ci się czat?',
  'chat.guestCta.link': 'Zarejestruj się za darmo',
  'chat.guestCta.rest': 'aby zapisać swój profil, obserwować innych i pozostać w kontakcie ze znajomymi.',

  // --- Legacy keys (kept for existing t() callers) ---
  'landing.title': 'Prywatne pokoje czatu jeden na jeden',
  'landing.subtitle': 'Utwórz pokój, udostępnij link i odbieraj napiwki.',
  'landing.cta.create': 'Utwórz pokój',
  'landing.cta.join': 'Dołącz do pokoju',
  'create.name': 'Nazwa pokoju',
  'create.submit': 'Utwórz pokój',
  'tip.send': 'Wyślij Tipsy',
  'wallet.payout.min': 'Minimum {min} Tipsys',
};
