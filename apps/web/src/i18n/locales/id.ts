import type { MessageKey } from './es';

export const id: { [K in MessageKey]?: string } = {
  // --- Common ---
  'common.loading': 'Memuat…',
  'common.save': 'Simpan',
  'common.cancel': 'Batal',
  'common.close': 'Tutup',
  'common.retry': 'Coba lagi',
  'common.back': 'Kembali',
  'common.backHome': 'Kembali ke beranda',
  'common.send': 'Kirim',
  'common.online': 'Online sekarang',
  'common.offline': 'Offline',
  'common.online.short': 'Online',

  // --- Header / nav ---
  'nav.createChat': 'Buat chat',
  'nav.howItWorks': 'Cara kerja',
  'nav.features': 'Fitur',
  'nav.wallet': 'Dompet',
  'nav.login': 'Masuk',
  'nav.logout': 'Keluar',
  'nav.messages': 'Pesan',

  // --- Footer ---
  'footer.tagline': 'Ruang chat pribadi satu lawan satu dengan tip.',
  'footer.col.platform': 'Platform',
  'footer.col.legal': 'Legal',
  'footer.col.support': 'Dukungan',
  'footer.link.createChat': 'Buat chat',
  'footer.link.howItWorks': 'Cara kerja',
  'footer.link.features': 'Fitur',
  'footer.link.terms': 'Ketentuan layanan',
  'footer.link.privacy': 'Kebijakan privasi',
  'footer.link.creators': 'Panduan kreator',
  'footer.link.contact': 'Kontak',
  'footer.rights': 'Semua hak dilindungi.',
  'footer.madeWith': 'Dibuat dengan ❤ untuk para kreator',

  // --- Home / landing ---
  'home.hero.title': 'Ruang chat pribadi satu lawan satu',
  'home.hero.subtitle': 'Ngobrol dengan siapa pun lewat video call, suara, atau teks saja.',
  'home.hero.cta': 'Buat ruang chat',
  'home.hero.live': 'LIVE: SESI PRIVAT',
  'home.discover.title': 'Cari teman baru',
  'home.discover.subtitle': 'Ikuti mereka atau kirim pesan untuk mulai ngobrol.',
  'home.discover.message': 'Pesan',
  'home.finalCta.cta': 'Buat ruang chat',

  // --- Auth ---
  'auth.login': 'Masuk',
  'auth.signup': 'Buat akun',
  'auth.email': 'Email',
  'auth.password': 'Kata sandi',
  'auth.displayName': 'Nama kamu',
  'auth.haveAccount': 'Sudah punya akun?',
  'auth.noAccount': 'Belum punya akun?',

  // --- Profile ---
  'profile.follow': 'Ikuti',
  'profile.following': 'Mengikuti',
  'profile.message': 'Pesan',
  'profile.messageCta': 'Kirim pesan untuk mulai ngobrol',
  'profile.followers': 'pengikut',
  'profile.followingCount': 'mengikuti',
  'profile.editProfile': 'Edit profil',
  'profile.memberSince': 'Di tiptalk.chat sejak {date}',
  'profile.gallery': 'Galeri',
  'profile.privatePhoto': 'Foto pribadi',
  'profile.notFound.title': 'Profil tidak ditemukan',
  'profile.notFound.body': 'Pengguna ini tidak ada atau sudah tidak tersedia.',

  // --- Messages / composer ---
  'msg.composer.title': 'Pesan untuk',
  'msg.composer.label': 'Pesan kamu',
  'msg.composer.placeholder': 'Tulis pesan untuk {name} dan mulai ngobrol…',
  'msg.composer.send': 'Kirim pesan',
  'msg.composer.sent.title': 'Pesan terkirim!',
  'msg.composer.sent.body': '{name} akan menerima notifikasi email untuk masuk dan membalasmu.',
  'msg.inbox.title': 'Pesan',
  'msg.inbox.empty': 'Belum ada pesan',
  'msg.inbox.reply': 'Tulis balasanmu…',

  // --- Wallet ---
  'wallet.title': 'Dompet',
  'wallet.balance': 'Saldo',
  'wallet.buy': 'Beli Tipsys',
  'wallet.payout.request': 'Ajukan pencairan',
  'wallet.activate': 'Aktifkan pencairan',

  // --- Room / chat ---
  'chat.send': 'Kirim',
  'chat.placeholder': 'Tulis pesan…',
  'chat.guestCta.q': 'Suka dengan chatnya?',
  'chat.guestCta.link': 'Daftar gratis',
  'chat.guestCta.rest': 'untuk menyimpan profilmu, mengikuti orang lain, dan tetap terhubung dengan teman-temanmu.',

  // --- Legacy keys (kept for existing t() callers) ---
  'landing.title': 'Ruang chat pribadi satu lawan satu',
  'landing.subtitle': 'Buat ruang, bagikan tautannya, dan terima tip.',
  'landing.cta.create': 'Buat ruang',
  'landing.cta.join': 'Gabung ke ruang',
  'create.name': 'Nama ruang',
  'create.submit': 'Buat ruang',
  'tip.send': 'Kirim Tipsy',
  'wallet.payout.min': 'Minimal {min} Tipsys',
};
