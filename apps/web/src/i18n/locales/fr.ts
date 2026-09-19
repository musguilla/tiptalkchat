import type { MessageKey } from './es';

export const fr: { [K in MessageKey]?: string } = {
  // --- Common ---
  'common.loading': 'Chargement…',
  'common.save': 'Enregistrer',
  'common.cancel': 'Annuler',
  'common.close': 'Fermer',
  'common.retry': 'Réessayer',
  'common.back': 'Retour',
  'common.backHome': 'Retour à l’accueil',
  'common.send': 'Envoyer',
  'common.online': 'En ligne maintenant',
  'common.offline': 'Hors ligne',
  'common.online.short': 'En ligne',

  // --- Header / nav ---
  'nav.createChat': 'Créer un chat',
  'nav.howItWorks': 'Comment ça marche',
  'nav.features': 'Fonctionnalités',
  'nav.wallet': 'Portefeuille',
  'nav.login': 'Se connecter',
  'nav.logout': 'Se déconnecter',
  'nav.messages': 'Messages',

  // --- Footer ---
  'footer.tagline': 'Salons de chat privés avec pourboires.',
  'footer.col.platform': 'Plateforme',
  'footer.col.legal': 'Mentions légales',
  'footer.col.support': 'Assistance',
  'footer.link.createChat': 'Créer un chat',
  'footer.link.howItWorks': 'Comment ça marche',
  'footer.link.features': 'Fonctionnalités',
  'footer.link.terms': 'Conditions d’utilisation',
  'footer.link.privacy': 'Politique de confidentialité',
  'footer.link.creators': 'Guide des créateurs',
  'footer.link.contact': 'Contact',
  'footer.rights': 'Tous droits réservés.',
  'footer.madeWith': 'Fait avec ❤ pour les créateurs',

  // --- Home / landing ---
  'home.hero.title': 'Salons de chat privés en tête-à-tête',
  'home.hero.subtitle': 'Discute avec qui tu veux en vidéo, en voix ou juste par texte.',
  'home.hero.cta': 'Créer un salon de chat',
  'home.hero.live': 'LIVE : SESSION PRIVÉE',
  'home.discover.title': 'Fais-toi de nouveaux amis',
  'home.discover.subtitle': 'Suis-les ou envoie-leur un message pour discuter.',
  'home.discover.message': 'Message',
  'home.finalCta.cta': 'Créer un salon de chat',

  // --- Auth ---
  'auth.login': 'Se connecter',
  'auth.signup': 'Créer un compte',
  'auth.email': 'E-mail',
  'auth.password': 'Mot de passe',
  'auth.displayName': 'Ton nom',
  'auth.haveAccount': 'Tu as déjà un compte ?',
  'auth.noAccount': 'Tu n’as pas de compte ?',

  // --- Profile ---
  'profile.follow': 'Suivre',
  'profile.following': 'Abonné',
  'profile.message': 'Message',
  'profile.messageCta': 'Envoie-lui un message pour discuter',
  'profile.followers': 'abonnés',
  'profile.followingCount': 'abonnements',
  'profile.editProfile': 'Modifier le profil',
  'profile.memberSince': 'Sur tiptalk.chat depuis {date}',
  'profile.gallery': 'Galerie',
  'profile.privatePhoto': 'Photo privée',
  'profile.notFound.title': 'Profil introuvable',
  'profile.notFound.body': 'Cet utilisateur n’existe pas ou n’est plus disponible.',

  // --- Messages / composer ---
  'msg.composer.title': 'Message à',
  'msg.composer.label': 'Ton message',
  'msg.composer.placeholder': 'Écris à {name} pour commencer à discuter…',
  'msg.composer.send': 'Envoyer le message',
  'msg.composer.sent.title': 'Message envoyé !',
  'msg.composer.sent.body': '{name} recevra un e-mail pour venir te répondre.',
  'msg.inbox.title': 'Messages',
  'msg.inbox.empty': 'Pas encore de messages',
  'msg.inbox.reply': 'Écris ta réponse…',

  // --- Wallet ---
  'wallet.title': 'Portefeuille',
  'wallet.balance': 'Solde',
  'wallet.buy': 'Acheter des Tipsys',
  'wallet.payout.request': 'Demander un versement',
  'wallet.activate': 'Activer les versements',

  // --- Room / chat ---
  'chat.send': 'Envoyer',
  'chat.placeholder': 'Écris un message…',
  'chat.guestCta.q': 'Tu aimes le chat ?',
  'chat.guestCta.link': 'Inscris-toi gratuitement',
  'chat.guestCta.rest': 'pour enregistrer ton profil, suivre d’autres personnes et rester en contact avec tes amis.',

  // --- Legacy keys (kept for existing t() callers) ---
  'landing.title': 'Salons de chat privés en tête-à-tête',
  'landing.subtitle': 'Crée un salon, partage le lien et reçois des pourboires.',
  'landing.cta.create': 'Créer un salon',
  'landing.cta.join': 'Rejoindre un salon',
  'create.name': 'Nom du salon',
  'create.submit': 'Créer un salon',
  'tip.send': 'Envoyer un Tipsy',
  'wallet.payout.min': 'Minimum {min} Tipsys',
};
