import type { MessageKey } from './es';

export const ru: { [K in MessageKey]?: string } = {
  // --- Common ---
  'common.loading': 'Загрузка…',
  'common.save': 'Сохранить',
  'common.cancel': 'Отмена',
  'common.close': 'Закрыть',
  'common.retry': 'Повторить',
  'common.back': 'Назад',
  'common.backHome': 'На главную',
  'common.send': 'Отправить',
  'common.online': 'Сейчас в сети',
  'common.offline': 'Не в сети',
  'common.online.short': 'В сети',

  // --- Header / nav ---
  'nav.createChat': 'Создать чат',
  'nav.howItWorks': 'Как это работает',
  'nav.features': 'Возможности',
  'nav.wallet': 'Кошелёк',
  'nav.login': 'Войти',
  'nav.logout': 'Выйти',
  'nav.messages': 'Сообщения',

  // --- Footer ---
  'footer.tagline': 'Приватные чаты с чаевыми.',
  'footer.col.platform': 'Платформа',
  'footer.col.legal': 'Правовая информация',
  'footer.col.support': 'Поддержка',
  'footer.link.createChat': 'Создать чат',
  'footer.link.howItWorks': 'Как это работает',
  'footer.link.features': 'Возможности',
  'footer.link.terms': 'Условия использования',
  'footer.link.privacy': 'Политика конфиденциальности',
  'footer.link.creators': 'Гид для авторов',
  'footer.link.contact': 'Контакты',
  'footer.rights': 'Все права защищены.',
  'footer.madeWith': 'Сделано с ❤ для авторов',

  // --- Home / landing ---
  'home.hero.title': 'Приватные чаты один на один',
  'home.hero.subtitle': 'Общайтесь с кем угодно по видеозвонку, голосом или просто текстом.',
  'home.hero.cta': 'Создать комнату чата',
  'home.hero.live': 'LIVE: ПРИВАТНАЯ СЕССИЯ',
  'home.discover.title': 'Найди новых друзей',
  'home.discover.subtitle': 'Подпишись или напиши сообщение, чтобы начать общение.',
  'home.discover.message': 'Сообщение',
  'home.finalCta.cta': 'Создать комнату чата',

  // --- Auth ---
  'auth.login': 'Войти',
  'auth.signup': 'Создать аккаунт',
  'auth.email': 'Email',
  'auth.password': 'Пароль',
  'auth.displayName': 'Ваше имя',
  'auth.haveAccount': 'Уже есть аккаунт?',
  'auth.noAccount': 'Нет аккаунта?',

  // --- Profile ---
  'profile.follow': 'Подписаться',
  'profile.following': 'Вы подписаны',
  'profile.message': 'Сообщение',
  'profile.messageCta': 'Напишите сообщение, чтобы начать чат',
  'profile.followers': 'подписчиков',
  'profile.followingCount': 'подписок',
  'profile.editProfile': 'Редактировать профиль',
  'profile.memberSince': 'В tiptalk.chat с {date}',
  'profile.gallery': 'Галерея',
  'profile.privatePhoto': 'Приватное фото',
  'profile.notFound.title': 'Профиль не найден',
  'profile.notFound.body': 'Этот пользователь не существует или больше недоступен.',

  // --- Messages / composer ---
  'msg.composer.title': 'Сообщение для',
  'msg.composer.label': 'Ваше сообщение',
  'msg.composer.placeholder': 'Напишите {name}, чтобы начать общение…',
  'msg.composer.send': 'Отправить сообщение',
  'msg.composer.sent.title': 'Сообщение отправлено!',
  'msg.composer.sent.body': '{name} получит уведомление на почту, чтобы зайти и ответить вам.',
  'msg.inbox.title': 'Сообщения',
  'msg.inbox.empty': 'Пока нет сообщений',
  'msg.inbox.reply': 'Напишите ответ…',

  // --- Wallet ---
  'wallet.title': 'Кошелёк',
  'wallet.balance': 'Баланс',
  'wallet.buy': 'Купить Tipsys',
  'wallet.payout.request': 'Запросить выплату',
  'wallet.activate': 'Активировать выплаты',

  // --- Room / chat ---
  'chat.send': 'Отправить',
  'chat.placeholder': 'Напишите сообщение…',
  'chat.guestCta.q': 'Нравится чат?',
  'chat.guestCta.link': 'Зарегистрируйтесь бесплатно',
  'chat.guestCta.rest': 'чтобы сохранить профиль, подписываться на других и оставаться на связи с друзьями.',

  // --- Legacy keys (kept for existing t() callers) ---
  'landing.title': 'Приватные чаты один на один',
  'landing.subtitle': 'Создайте комнату, поделитесь ссылкой и получайте чаевые.',
  'landing.cta.create': 'Создать комнату',
  'landing.cta.join': 'Присоединиться к комнате',
  'create.name': 'Название комнаты',
  'create.submit': 'Создать комнату',
  'tip.send': 'Отправить Tipsy',
  'wallet.payout.min': 'Минимум {min} Tipsys',
};
