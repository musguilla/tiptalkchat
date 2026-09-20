import type { MessageKey } from './es';

export const ko: { [K in MessageKey]?: string } = {
  // --- Common ---
  'common.loading': '불러오는 중…',
  'common.save': '저장',
  'common.cancel': '취소',
  'common.close': '닫기',
  'common.retry': '다시 시도',
  'common.back': '뒤로',
  'common.backHome': '홈으로',
  'common.send': '보내기',
  'common.online': '지금 접속 중',
  'common.offline': '오프라인',
  'common.online.short': '온라인',

  // --- Header / nav ---
  'nav.createChat': '채팅 만들기',
  'nav.howItWorks': '이용 방법',
  'nav.features': '기능',
  'nav.wallet': '지갑',
  'nav.login': '로그인',
  'nav.logout': '로그아웃',
  'nav.messages': '메시지',

  // --- Footer ---
  'footer.tagline': '팁을 주고받는 프라이빗 1대1 채팅방.',
  'footer.col.platform': '플랫폼',
  'footer.col.legal': '법적 고지',
  'footer.col.support': '지원',
  'footer.link.createChat': '채팅 만들기',
  'footer.link.howItWorks': '이용 방법',
  'footer.link.features': '기능',
  'footer.link.terms': '이용약관',
  'footer.link.privacy': '개인정보 처리방침',
  'footer.link.creators': '크리에이터 가이드',
  'footer.link.contact': '문의하기',
  'footer.rights': '모든 권리 보유.',
  'footer.madeWith': '크리에이터를 위해 ❤ 를 담아 제작',

  // --- Home / landing ---
  'home.hero.title': '프라이빗 1대1 채팅방',
  'home.hero.subtitle': '영상통화, 음성, 텍스트로 원하는 사람과 채팅하세요.',
  'home.hero.cta': '채팅방 만들기',
  'home.hero.live': 'LIVE: 프라이빗 세션',
  'home.discover.title': '새로운 친구를 만나요',
  'home.discover.subtitle': '팔로우하거나 메시지를 보내 채팅을 시작하세요.',
  'home.discover.message': '메시지',
  'home.finalCta.cta': '채팅방 만들기',

  // --- Auth ---
  'auth.login': '로그인',
  'auth.signup': '계정 만들기',
  'auth.email': '이메일',
  'auth.password': '비밀번호',
  'auth.displayName': '이름',
  'auth.haveAccount': '이미 계정이 있으신가요?',
  'auth.noAccount': '계정이 없으신가요?',

  // --- Profile ---
  'profile.follow': '팔로우',
  'profile.following': '팔로잉',
  'profile.message': '메시지',
  'profile.messageCta': '메시지를 보내 채팅을 시작하세요',
  'profile.followers': '팔로워',
  'profile.followingCount': '팔로잉',
  'profile.editProfile': '프로필 편집',
  'profile.memberSince': '{date}부터 tiptalk.chat 이용',
  'profile.gallery': '갤러리',
  'profile.privatePhoto': '비공개 사진',
  'profile.notFound.title': '프로필을 찾을 수 없습니다',
  'profile.notFound.body': '이 사용자는 존재하지 않거나 더 이상 이용할 수 없습니다.',

  // --- Messages / composer ---
  'msg.composer.title': '받는 사람',
  'msg.composer.label': '메시지',
  'msg.composer.placeholder': '{name}님에게 메시지를 보내 채팅을 시작하세요…',
  'msg.composer.send': '메시지 보내기',
  'msg.composer.sent.title': '메시지를 보냈어요!',
  'msg.composer.sent.body': '{name}님에게 이메일 알림이 전송되어 답장하러 올 거예요.',
  'msg.inbox.title': '메시지',
  'msg.inbox.empty': '아직 메시지가 없어요',
  'msg.inbox.reply': '답장을 입력하세요…',

  // --- Wallet ---
  'wallet.title': '지갑',
  'wallet.balance': '잔액',
  'wallet.buy': 'Tipsys 구매',
  'wallet.payout.request': '출금 신청',
  'wallet.activate': '출금 활성화',

  // --- Room / chat ---
  'chat.send': '보내기',
  'chat.placeholder': '메시지를 입력하세요…',
  'chat.guestCta.q': '채팅이 마음에 드나요?',
  'chat.guestCta.link': '무료로 가입',
  'chat.guestCta.rest': '하면 프로필을 저장하고, 다른 사람을 팔로우하고, 친구들과 계속 연결될 수 있어요.',

  // --- Create room page ---
  'create.title': '채팅방 만들기',
  'create.creatingAs': '{name}(으)로 만드는 중이에요.',
  'create.logout': '로그아웃',
  'create.toCreateAnon': '계정 없이 만들 수 있어요.',
  'create.anonDisclaimer': '계정이 필요 없어요. 닉네임과 채팅방 이름만 입력하세요.',
  'create.yourNick': '닉네임',
  'create.nickPlaceholder': '이름이 뭐예요?',
  'create.roomName': '채팅방 이름',
  'create.roomPlaceholder': '마르타의 파티',
  'create.sessionExpired': '세션이 만료되었어요. 다시 로그인하거나 게스트로 채팅방을 만드세요.',
  'create.error': '채팅방을 만들 수 없어요. 다시 시도해 주세요.',
  'create.login': '로그인',
  'create.ready.title': '채팅방이 준비됐어요!',
  'create.ready.subtitle': '초대하고 싶은 사람에게 이 링크를 공유하세요.',
  'create.ready.linkLabel': '채팅방 링크',
  'create.ready.copied': '복사됨',
  'create.ready.copy': '복사',
  'create.ready.enter': '채팅방 입장하기',

  // --- Legacy keys (kept for existing t() callers) ---
  'landing.title': '1대1 프라이빗 채팅방',
  'landing.subtitle': '채팅방을 만들고, 링크를 공유하고, 팁을 받으세요.',
  'landing.cta.create': '채팅방 만들기',
  'landing.cta.join': '채팅방 참여하기',
  'create.name': '채팅방 이름',
  'create.submit': '채팅방 만들기',
  'tip.send': 'Tipsy 보내기',
  'wallet.payout.min': '최소 {min} Tipsys',
};
