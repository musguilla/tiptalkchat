import type { MessageKey } from './es';

export const en: { [K in MessageKey]?: string } = {
  // --- Common ---
  'common.loading': 'Loading…',
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.close': 'Close',
  'common.retry': 'Retry',
  'common.back': 'Back',
  'common.backHome': 'Back to home',
  'common.send': 'Send',
  'common.online': 'Online now',
  'common.offline': 'Offline',
  'common.online.short': 'Online',

  // --- Header / nav ---
  'nav.createChat': 'Create chat',
  'nav.howItWorks': 'How it works',
  'nav.features': 'Features',
  'nav.wallet': 'Wallet',
  'nav.login': 'Log in',
  'nav.logout': 'Log out',
  'nav.messages': 'Messages',

  // --- Footer ---
  'footer.tagline': 'Private chat rooms with tips.',
  'footer.col.platform': 'Platform',
  'footer.col.legal': 'Legal',
  'footer.col.support': 'Support',
  'footer.link.createChat': 'Create chat',
  'footer.link.howItWorks': 'How it works',
  'footer.link.features': 'Features',
  'footer.link.terms': 'Terms of service',
  'footer.link.privacy': 'Privacy policy',
  'footer.link.creators': 'Creator guide',
  'footer.link.contact': 'Contact',
  'footer.rights': 'All rights reserved.',
  'footer.madeWith': 'Made with ❤ for creators',

  // --- Home / landing ---
  'home.hero.title': 'Private 1-on-1 chat rooms',
  'home.hero.subtitle': 'Chat with anyone by video, voice or just text.',
  'home.hero.cta': 'Create chat room',
  'home.hero.live': 'LIVE: PRIVATE SESSION',
  'home.discover.title': 'Make new friends',
  'home.discover.subtitle': 'Follow them or send a message to chat.',
  'home.discover.message': 'Message',
  'home.finalCta.cta': 'Create chat room',

  // --- Auth ---
  'auth.login': 'Log in',
  'auth.signup': 'Sign up',
  'auth.email': 'Email',
  'auth.password': 'Password',
  'auth.displayName': 'Your name',
  'auth.haveAccount': 'Already have an account?',
  'auth.noAccount': 'Don’t have an account?',

  // --- Profile ---
  'profile.follow': 'Follow',
  'profile.following': 'Following',
  'profile.message': 'Message',
  'profile.messageCta': 'Send a message to chat',
  'profile.followers': 'followers',
  'profile.followingCount': 'following',
  'profile.editProfile': 'Edit profile',
  'profile.memberSince': 'On tiptalk.chat since {date}',
  'profile.gallery': 'Gallery',
  'profile.privatePhoto': 'Private photo',
  'profile.notFound.title': 'Profile not found',
  'profile.notFound.body': 'This user doesn’t exist or is no longer available.',

  // --- Messages / composer ---
  'msg.composer.title': 'Message to',
  'msg.composer.label': 'Your message',
  'msg.composer.placeholder': 'Write to {name} to start chatting…',
  'msg.composer.send': 'Send message',
  'msg.composer.sent.title': 'Message sent!',
  'msg.composer.sent.body': '{name} will get an email notification to come and reply to you.',
  'msg.inbox.title': 'Messages',
  'msg.inbox.empty': 'No messages yet',
  'msg.inbox.reply': 'Write your reply…',

  // --- Wallet ---
  'wallet.title': 'Wallet',
  'wallet.balance': 'Balance',
  'wallet.buy': 'Buy Tipsys',
  'wallet.payout.request': 'Request payout',
  'wallet.activate': 'Enable payouts',

  // --- Room / chat ---
  'chat.send': 'Send',
  'chat.placeholder': 'Write a message…',
  'chat.guestCta.q': 'Enjoying the chat?',
  'chat.guestCta.link': 'Sign up free',
  'chat.guestCta.rest': 'to save your profile, follow others and stay in touch with your friends.',

  // --- Create room page ---
  'create.title': 'Create room',
  'create.creatingAs': 'You’re creating as {name}.',
  'create.logout': 'Log out',
  'create.toCreateAnon': 'to create without an account.',
  'create.anonDisclaimer': 'You don’t need an account. Just add your nickname and a name for the room.',
  'create.yourNick': 'Your nickname',
  'create.nickPlaceholder': 'What’s your name?',
  'create.roomName': 'Room name',
  'create.roomPlaceholder': 'Marta’s party',
  'create.sessionExpired': 'Your session has expired. Log in again or create the room as a guest.',
  'create.error': 'Couldn’t create the room. Please try again.',
  'create.login': 'Log in',
  'create.ready.title': 'Your room is ready!',
  'create.ready.subtitle': 'Share this link with anyone you want to invite.',
  'create.ready.linkLabel': 'Room link',
  'create.ready.copied': 'Copied',
  'create.ready.copy': 'Copy',
  'create.ready.enter': 'Enter your room',

  // --- Legacy keys (kept for existing t() callers) ---
  'landing.title': 'Private one-on-one chat rooms',
  'landing.subtitle': 'Create a room, share the link and get tips.',
  'landing.cta.create': 'Create room',
  'landing.cta.join': 'Join a room',
  'create.name': 'Room name',
  'create.submit': 'Create room',
  'tip.send': 'Send Tipsy',
  'wallet.payout.min': 'Minimum {min} Tipsys',
};
