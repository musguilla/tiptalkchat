import type { MessageKey } from './es';

export const ptBr: { [K in MessageKey]?: string } = {
  // --- Common ---
  'common.loading': 'Carregando…',
  'common.save': 'Salvar',
  'common.cancel': 'Cancelar',
  'common.close': 'Fechar',
  'common.retry': 'Tentar de novo',
  'common.back': 'Voltar',
  'common.backHome': 'Voltar ao início',
  'common.send': 'Enviar',
  'common.online': 'Online agora',
  'common.offline': 'Offline',
  'common.online.short': 'Online',

  // --- Header / nav ---
  'nav.createChat': 'Criar chat',
  'nav.howItWorks': 'Como funciona',
  'nav.features': 'Recursos',
  'nav.wallet': 'Carteira',
  'nav.login': 'Entrar',
  'nav.logout': 'Sair',
  'nav.messages': 'Mensagens',

  // --- Footer ---
  'footer.tagline': 'Salas de chat privadas com tips.',
  'footer.col.platform': 'Plataforma',
  'footer.col.legal': 'Jurídico',
  'footer.col.support': 'Suporte',
  'footer.link.createChat': 'Criar chat',
  'footer.link.howItWorks': 'Como funciona',
  'footer.link.features': 'Recursos',
  'footer.link.terms': 'Termos de serviço',
  'footer.link.privacy': 'Política de privacidade',
  'footer.link.creators': 'Guia para criadores',
  'footer.link.contact': 'Contato',
  'footer.rights': 'Todos os direitos reservados.',
  'footer.madeWith': 'Feito com ❤ para criadores',

  // --- Home / landing ---
  'home.hero.title': 'Salas de chat privadas 1 a 1',
  'home.hero.subtitle': 'Converse com quem quiser por videochamada, voz ou só texto.',
  'home.hero.cta': 'Criar sala de chat',
  'home.hero.live': 'LIVE: SESSÃO PRIVADA',
  'home.discover.title': 'Faça novos amigos',
  'home.discover.subtitle': 'Siga ou mande uma mensagem para conversar.',
  'home.discover.message': 'Mensagem',
  'home.finalCta.cta': 'Criar sala de chat',

  // --- Auth ---
  'auth.login': 'Entrar',
  'auth.signup': 'Criar conta',
  'auth.email': 'Email',
  'auth.password': 'Senha',
  'auth.displayName': 'Seu nome',
  'auth.haveAccount': 'Já tem conta?',
  'auth.noAccount': 'Ainda não tem conta?',

  // --- Profile ---
  'profile.follow': 'Seguir',
  'profile.following': 'Seguindo',
  'profile.message': 'Mensagem',
  'profile.messageCta': 'Mande uma mensagem para conversar',
  'profile.followers': 'seguidores',
  'profile.followingCount': 'seguindo',
  'profile.editProfile': 'Editar perfil',
  'profile.memberSince': 'No tiptalk.chat desde {date}',
  'profile.gallery': 'Galeria',
  'profile.privatePhoto': 'Foto privada',
  'profile.notFound.title': 'Perfil não encontrado',
  'profile.notFound.body': 'Este usuário não existe ou não está mais disponível.',

  // --- Messages / composer ---
  'msg.composer.title': 'Mensagem para',
  'msg.composer.label': 'Sua mensagem',
  'msg.composer.placeholder': 'Escreva para {name} e comece a conversar…',
  'msg.composer.send': 'Enviar mensagem',
  'msg.composer.sent.title': 'Mensagem enviada!',
  'msg.composer.sent.body': '{name} vai receber um aviso por email para entrar e responder você.',
  'msg.inbox.title': 'Mensagens',
  'msg.inbox.empty': 'Ainda sem mensagens',
  'msg.inbox.reply': 'Escreva sua resposta…',

  // --- Wallet ---
  'wallet.title': 'Carteira',
  'wallet.balance': 'Saldo',
  'wallet.buy': 'Comprar Tipsys',
  'wallet.payout.request': 'Solicitar saque',
  'wallet.activate': 'Ativar saques',

  // --- Room / chat ---
  'chat.send': 'Enviar',
  'chat.placeholder': 'Escreva uma mensagem…',
  'chat.guestCta.q': 'Curtindo o chat?',
  'chat.guestCta.link': 'Cadastre-se grátis',
  'chat.guestCta.rest': 'para salvar seu perfil, seguir outras pessoas e manter contato com seus amigos.',

  // --- Legacy keys (kept for existing t() callers) ---
  'landing.title': 'Salas de chat privadas um a um',
  'landing.subtitle': 'Crie uma sala, compartilhe o link e receba gorjetas.',
  'landing.cta.create': 'Criar sala',
  'landing.cta.join': 'Entrar em uma sala',
  'create.name': 'Nome da sala',
  'create.submit': 'Criar sala',
  'tip.send': 'Enviar Tipsy',
  'wallet.payout.min': 'Mínimo {min} Tipsys',
};
