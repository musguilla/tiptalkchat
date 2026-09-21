// Source dictionary (Spanish). Every other locale mirrors these keys.
// Keep keys stable; translators only change the values.
export const es = {
  // --- Common ---
  'common.loading': 'Cargando…',
  'common.save': 'Guardar',
  'common.cancel': 'Cancelar',
  'common.close': 'Cerrar',
  'common.retry': 'Reintentar',
  'common.back': 'Volver',
  'common.backHome': 'Volver al inicio',
  'common.send': 'Enviar',
  'common.online': 'Conectado ahora',
  'common.offline': 'Desconectado',
  'common.online.short': 'En línea',

  // --- Header / nav ---
  'nav.createChat': 'Crear chat',
  'nav.howItWorks': 'Cómo funciona',
  'nav.features': 'Características',
  'nav.wallet': 'Monedero',
  'nav.login': 'Iniciar sesión',
  'nav.logout': 'Cerrar sesión',
  'nav.messages': 'Mensajes',

  // --- Footer ---
  'footer.tagline': 'Salas de chats privadas con propinas. Ganar dinero online chateando',
  'footer.col.platform': 'Plataforma',
  'footer.col.legal': 'Legal',
  'footer.col.support': 'Soporte',
  'footer.link.createChat': 'Crear chat',
  'footer.link.howItWorks': 'Cómo funciona',
  'footer.link.features': 'Características',
  'footer.link.terms': 'Términos del servicio',
  'footer.link.privacy': 'Política de privacidad',
  'footer.link.creators': 'Guía para creadores',
  'footer.link.contact': 'Contacto',
  'footer.rights': 'Todos los derechos reservados.',
  'footer.madeWith': 'Hecho con ❤ para creadores',

  // --- Home / landing ---
  'home.hero.title': 'Salas de chats privadas 1 a 1',
  'home.hero.subtitle': 'Chatea con quien quieras con videollamada, voz o solo texto.',
  'home.hero.cta': 'Crear sala de chat',
  'home.hero.live': 'LIVE: SESIÓN PRIVADA',
  'home.discover.title': 'Haz nuevos amig@s',
  'home.discover.subtitle': 'Síguelos o mándales un mensaje para chatear.',
  'home.discover.message': 'Mensaje',
  'home.finalCta.cta': 'Crear sala de chat',

  // --- Auth ---
  'auth.login': 'Iniciar sesión',
  'auth.signup': 'Crear cuenta',
  'auth.email': 'Email',
  'auth.password': 'Contraseña',
  'auth.displayName': 'Tu nombre',
  'auth.haveAccount': '¿Ya tienes cuenta?',
  'auth.noAccount': '¿No tienes cuenta?',

  // --- Profile ---
  'profile.follow': 'Seguir',
  'profile.following': 'Siguiendo',
  'profile.message': 'Mensaje',
  'profile.messageCta': 'Envíale un mensaje para chatear',
  'profile.followers': 'seguidores',
  'profile.followingCount': 'siguiendo',
  'profile.editProfile': 'Editar perfil',
  'profile.memberSince': 'En tiptalk.chat desde {date}',
  'profile.gallery': 'Galería',
  'profile.privatePhoto': 'Foto privada',
  'profile.notFound.title': 'Perfil no encontrado',
  'profile.notFound.body': 'Este usuario no existe o ya no está disponible.',

  // --- Messages / composer ---
  'msg.composer.title': 'Mensaje para',
  'msg.composer.label': 'Tu mensaje',
  'msg.composer.placeholder': 'Escríbele a {name} para empezar a chatear…',
  'msg.composer.send': 'Enviar mensaje',
  'msg.composer.sent.title': '¡Mensaje enviado!',
  'msg.composer.sent.body': '{name} recibirá un aviso por correo para que entre a responderte.',
  'msg.inbox.title': 'Mensajes',
  'msg.inbox.empty': 'Sin mensajes todavía',
  'msg.inbox.reply': 'Escribe tu respuesta…',

  // --- Wallet ---
  'wallet.title': 'Monedero',
  'wallet.balance': 'Saldo',
  'wallet.buy': 'Comprar Tipsys',
  'wallet.payout.request': 'Solicitar cobro',
  'wallet.activate': 'Activar cobros',

  // --- Room / chat ---
  'chat.send': 'Enviar',
  'chat.placeholder': 'Escribe un mensaje…',
  'chat.guestCta.q': '¿Te gusta el chat?',
  'chat.guestCta.link': 'Regístrate gratis',
  'chat.guestCta.rest': 'para guardar tu perfil, seguir a otros y estar en contacto con tus amig@s.',

  // --- Create room page ---
  'create.title': 'Crear sala',
  'create.creatingAs': 'Creas como {name}.',
  'create.logout': 'Cerrar sesión',
  'create.toCreateAnon': 'para crear sin cuenta.',
  'create.anonDisclaimer': 'No necesitas cuenta. Solo pon tu nick y un nombre para la sala.',
  'create.yourNick': 'Tu nick',
  'create.nickPlaceholder': '¿Cómo te llamas?',
  'create.roomName': 'Nombre de la sala',
  'create.roomPlaceholder': 'Fiesta de Marta',
  'create.sessionExpired': 'Tu sesión ha caducado. Vuelve a iniciar sesión o crea la sala como invitado.',
  'create.error': 'No se pudo crear la sala. Inténtalo de nuevo.',
  'create.login': 'Iniciar sesión',
  'create.ready.title': '¡Tu sala está lista!',
  'create.ready.subtitle': 'Comparte este enlace con quien quieras invitar.',
  'create.ready.linkLabel': 'Enlace de la sala',
  'create.ready.copied': 'Copiado',
  'create.ready.copy': 'Copiar',
  'create.ready.enter': 'Entra a tu sala',

  // --- Legacy keys (kept for existing t() callers) ---
  'landing.title': 'Salas de chats privadas uno a uno',
  'landing.subtitle': 'Crea una sala, comparte el enlace y recibe propinas.',
  'landing.cta.create': 'Crear sala',
  'landing.cta.join': 'Unirme a una sala',
  'create.name': 'Nombre de la sala',
  'create.submit': 'Crear sala',
  'tip.send': 'Enviar Tipsy',
  'wallet.payout.min': 'Mínimo {min} Tipsys',
} as const;

export type MessageKey = keyof typeof es;
