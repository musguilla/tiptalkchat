import type { MessageKey } from './es';

export const ar: { [K in MessageKey]?: string } = {
  // --- Common ---
  'common.loading': 'جارٍ التحميل…',
  'common.save': 'حفظ',
  'common.cancel': 'إلغاء',
  'common.close': 'إغلاق',
  'common.retry': 'إعادة المحاولة',
  'common.back': 'رجوع',
  'common.backHome': 'العودة إلى الرئيسية',
  'common.send': 'إرسال',
  'common.online': 'متصل الآن',
  'common.offline': 'غير متصل',
  'common.online.short': 'متصل',

  // --- Header / nav ---
  'nav.createChat': 'إنشاء محادثة',
  'nav.howItWorks': 'كيف يعمل',
  'nav.features': 'المميزات',
  'nav.wallet': 'المحفظة',
  'nav.login': 'تسجيل الدخول',
  'nav.logout': 'تسجيل الخروج',
  'nav.messages': 'الرسائل',

  // --- Footer ---
  'footer.tagline': 'غرف محادثة خاصة مع إكراميات.',
  'footer.col.platform': 'المنصة',
  'footer.col.legal': 'قانوني',
  'footer.col.support': 'الدعم',
  'footer.link.createChat': 'إنشاء محادثة',
  'footer.link.howItWorks': 'كيف يعمل',
  'footer.link.features': 'المميزات',
  'footer.link.terms': 'شروط الخدمة',
  'footer.link.privacy': 'سياسة الخصوصية',
  'footer.link.creators': 'دليل المبدعين',
  'footer.link.contact': 'اتصل بنا',
  'footer.rights': 'جميع الحقوق محفوظة.',
  'footer.madeWith': 'صُنع بـ ❤ للمبدعين',

  // --- Home / landing ---
  'home.hero.title': 'غرف محادثة خاصة واحد لواحد',
  'home.hero.subtitle': 'تحدّث مع من تشاء عبر مكالمة فيديو أو صوت أو نص فقط.',
  'home.hero.cta': 'إنشاء غرفة محادثة',
  'home.hero.live': 'مباشر: جلسة خاصة',
  'home.discover.title': 'كوّن أصدقاء جدد',
  'home.discover.subtitle': 'تابعهم أو أرسل لهم رسالة لبدء المحادثة.',
  'home.discover.message': 'رسالة',
  'home.finalCta.cta': 'إنشاء غرفة محادثة',

  // --- Auth ---
  'auth.login': 'تسجيل الدخول',
  'auth.signup': 'إنشاء حساب',
  'auth.email': 'البريد الإلكتروني',
  'auth.password': 'كلمة المرور',
  'auth.displayName': 'اسمك',
  'auth.haveAccount': 'هل لديك حساب بالفعل؟',
  'auth.noAccount': 'ليس لديك حساب؟',

  // --- Profile ---
  'profile.follow': 'متابعة',
  'profile.following': 'تتابعه',
  'profile.message': 'رسالة',
  'profile.messageCta': 'أرسل له رسالة لبدء المحادثة',
  'profile.followers': 'متابع',
  'profile.followingCount': 'يتابع',
  'profile.editProfile': 'تعديل الملف الشخصي',
  'profile.memberSince': 'على tiptalk.chat منذ {date}',
  'profile.gallery': 'المعرض',
  'profile.privatePhoto': 'صورة خاصة',
  'profile.notFound.title': 'الملف الشخصي غير موجود',
  'profile.notFound.body': 'هذا المستخدم غير موجود أو لم يعد متاحًا.',

  // --- Messages / composer ---
  'msg.composer.title': 'رسالة إلى',
  'msg.composer.label': 'رسالتك',
  'msg.composer.placeholder': 'اكتب إلى {name} لبدء المحادثة…',
  'msg.composer.send': 'إرسال الرسالة',
  'msg.composer.sent.title': 'تم إرسال الرسالة!',
  'msg.composer.sent.body': 'سيتلقى {name} إشعارًا عبر البريد للدخول والرد عليك.',
  'msg.inbox.title': 'الرسائل',
  'msg.inbox.empty': 'لا توجد رسائل بعد',
  'msg.inbox.reply': 'اكتب ردك…',

  // --- Wallet ---
  'wallet.title': 'المحفظة',
  'wallet.balance': 'الرصيد',
  'wallet.buy': 'شراء Tipsys',
  'wallet.payout.request': 'طلب سحب',
  'wallet.activate': 'تفعيل السحب',

  // --- Room / chat ---
  'chat.send': 'إرسال',
  'chat.placeholder': 'اكتب رسالة…',
  'chat.guestCta.q': 'هل تعجبك المحادثة؟',
  'chat.guestCta.link': 'سجّل مجانًا',
  'chat.guestCta.rest': 'لحفظ ملفك الشخصي ومتابعة الآخرين والبقاء على تواصل مع أصدقائك.',

  // --- Create room page ---
  'create.title': 'إنشاء غرفة',
  'create.creatingAs': 'أنت تُنشئ باسم {name}.',
  'create.logout': 'تسجيل الخروج',
  'create.toCreateAnon': 'للإنشاء بدون حساب.',
  'create.anonDisclaimer': 'لا تحتاج إلى حساب. فقط أدخل لقبك واسمًا للغرفة.',
  'create.yourNick': 'لقبك',
  'create.nickPlaceholder': 'ما اسمك؟',
  'create.roomName': 'اسم الغرفة',
  'create.roomPlaceholder': 'حفلة مارتا',
  'create.sessionExpired': 'انتهت جلستك. سجّل الدخول من جديد أو أنشئ الغرفة كضيف.',
  'create.error': 'تعذّر إنشاء الغرفة. حاول مرة أخرى.',
  'create.login': 'تسجيل الدخول',
  'create.ready.title': 'غرفتك جاهزة!',
  'create.ready.subtitle': 'شارك هذا الرابط مع كل من تريد دعوته.',
  'create.ready.linkLabel': 'رابط الغرفة',
  'create.ready.copied': 'تم النسخ',
  'create.ready.copy': 'نسخ',
  'create.ready.enter': 'ادخل إلى غرفتك',

  // --- Legacy keys (kept for existing t() callers) ---
  'landing.title': 'غرف محادثة خاصة واحد لواحد',
  'landing.subtitle': 'أنشئ غرفة وشارك الرابط واحصل على الإكراميات.',
  'landing.cta.create': 'إنشاء غرفة',
  'landing.cta.join': 'الانضمام إلى غرفة',
  'create.name': 'اسم الغرفة',
  'create.submit': 'إنشاء غرفة',
  'tip.send': 'إرسال Tipsy',
  'wallet.payout.min': 'الحد الأدنى {min} Tipsys',
};
