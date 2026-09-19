import type { MessageKey } from './es';

export const ja: { [K in MessageKey]?: string } = {
  // --- Common ---
  'common.loading': '読み込み中…',
  'common.save': '保存',
  'common.cancel': 'キャンセル',
  'common.close': '閉じる',
  'common.retry': '再試行',
  'common.back': '戻る',
  'common.backHome': 'ホームに戻る',
  'common.send': '送信',
  'common.online': 'オンライン中',
  'common.offline': 'オフライン',
  'common.online.short': 'オンライン',

  // --- Header / nav ---
  'nav.createChat': 'チャットを作成',
  'nav.howItWorks': '使い方',
  'nav.features': '機能',
  'nav.wallet': 'ウォレット',
  'nav.login': 'ログイン',
  'nav.logout': 'ログアウト',
  'nav.messages': 'メッセージ',

  // --- Footer ---
  'footer.tagline': 'チップ付きのプライベートな1対1チャットルーム。',
  'footer.col.platform': 'プラットフォーム',
  'footer.col.legal': '法的情報',
  'footer.col.support': 'サポート',
  'footer.link.createChat': 'チャットを作成',
  'footer.link.howItWorks': '使い方',
  'footer.link.features': '機能',
  'footer.link.terms': '利用規約',
  'footer.link.privacy': 'プライバシーポリシー',
  'footer.link.creators': 'クリエイター向けガイド',
  'footer.link.contact': 'お問い合わせ',
  'footer.rights': '無断転載を禁じます。',
  'footer.madeWith': 'クリエイターのために ❤ を込めて',

  // --- Home / landing ---
  'home.hero.title': 'プライベートな1対1チャットルーム',
  'home.hero.subtitle': 'ビデオ通話・音声・テキストで、好きな相手とチャット。',
  'home.hero.cta': 'チャットルームを作成',
  'home.hero.live': 'LIVE：プライベートセッション',
  'home.discover.title': '新しい友だちを見つけよう',
  'home.discover.subtitle': 'フォローするか、メッセージを送ってチャットしよう。',
  'home.discover.message': 'メッセージ',
  'home.finalCta.cta': 'チャットルームを作成',

  // --- Auth ---
  'auth.login': 'ログイン',
  'auth.signup': 'アカウント作成',
  'auth.email': 'メール',
  'auth.password': 'パスワード',
  'auth.displayName': 'お名前',
  'auth.haveAccount': 'すでにアカウントをお持ちですか？',
  'auth.noAccount': 'アカウントをお持ちでないですか？',

  // --- Profile ---
  'profile.follow': 'フォロー',
  'profile.following': 'フォロー中',
  'profile.message': 'メッセージ',
  'profile.messageCta': 'メッセージを送ってチャットしよう',
  'profile.followers': 'フォロワー',
  'profile.followingCount': 'フォロー中',
  'profile.editProfile': 'プロフィールを編集',
  'profile.memberSince': '{date} から tiptalk.chat を利用',
  'profile.gallery': 'ギャラリー',
  'profile.privatePhoto': '非公開の写真',
  'profile.notFound.title': 'プロフィールが見つかりません',
  'profile.notFound.body': 'このユーザーは存在しないか、利用できなくなりました。',

  // --- Messages / composer ---
  'msg.composer.title': 'メッセージの宛先',
  'msg.composer.label': 'メッセージ',
  'msg.composer.placeholder': '{name} にメッセージを送ってチャットを始めよう…',
  'msg.composer.send': 'メッセージを送信',
  'msg.composer.sent.title': 'メッセージを送信しました！',
  'msg.composer.sent.body': '{name} にメール通知が届き、返信しに来てくれます。',
  'msg.inbox.title': 'メッセージ',
  'msg.inbox.empty': 'まだメッセージはありません',
  'msg.inbox.reply': '返信を入力…',

  // --- Wallet ---
  'wallet.title': 'ウォレット',
  'wallet.balance': '残高',
  'wallet.buy': 'Tipsys を購入',
  'wallet.payout.request': '出金を申請',
  'wallet.activate': '出金を有効化',

  // --- Room / chat ---
  'chat.send': '送信',
  'chat.placeholder': 'メッセージを入力…',
  'chat.guestCta.q': 'チャットは楽しい？',
  'chat.guestCta.link': '無料で登録',
  'chat.guestCta.rest': 'して、プロフィールを保存したり、他の人をフォローしたり、友だちとつながろう。',

  // --- Legacy keys (kept for existing t() callers) ---
  'landing.title': '1対1のプライベートチャットルーム',
  'landing.subtitle': 'ルームを作成し、リンクを共有して、チップを受け取ろう。',
  'landing.cta.create': 'ルームを作成',
  'landing.cta.join': 'ルームに参加',
  'create.name': 'ルーム名',
  'create.submit': 'ルームを作成',
  'tip.send': 'Tipsy を送る',
  'wallet.payout.min': '最低 {min} Tipsys',
};
