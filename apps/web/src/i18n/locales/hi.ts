import type { MessageKey } from './es';

export const hi: { [K in MessageKey]?: string } = {
  // --- Common ---
  'common.loading': 'लोड हो रहा है…',
  'common.save': 'सहेजें',
  'common.cancel': 'रद्द करें',
  'common.close': 'बंद करें',
  'common.retry': 'पुनः प्रयास करें',
  'common.back': 'वापस',
  'common.backHome': 'होम पर वापस जाएं',
  'common.send': 'भेजें',
  'common.online': 'अभी ऑनलाइन',
  'common.offline': 'ऑफ़लाइन',
  'common.online.short': 'ऑनलाइन',

  // --- Header / nav ---
  'nav.createChat': 'चैट बनाएं',
  'nav.howItWorks': 'यह कैसे काम करता है',
  'nav.features': 'विशेषताएं',
  'nav.wallet': 'वॉलेट',
  'nav.login': 'लॉग इन करें',
  'nav.logout': 'लॉग आउट करें',
  'nav.messages': 'संदेश',

  // --- Footer ---
  'footer.tagline': 'टिप्स के साथ निजी चैट रूम।',
  'footer.col.platform': 'प्लेटफ़ॉर्म',
  'footer.col.legal': 'कानूनी',
  'footer.col.support': 'सहायता',
  'footer.link.createChat': 'चैट बनाएं',
  'footer.link.howItWorks': 'यह कैसे काम करता है',
  'footer.link.features': 'विशेषताएं',
  'footer.link.terms': 'सेवा की शर्तें',
  'footer.link.privacy': 'गोपनीयता नीति',
  'footer.link.creators': 'क्रिएटर गाइड',
  'footer.link.contact': 'संपर्क करें',
  'footer.rights': 'सर्वाधिकार सुरक्षित।',
  'footer.madeWith': 'क्रिएटर्स के लिए ❤ से बनाया गया',

  // --- Home / landing ---
  'home.hero.title': 'निजी 1-टू-1 चैट रूम',
  'home.hero.subtitle': 'वीडियो कॉल, वॉइस या सिर्फ़ टेक्स्ट से किसी से भी चैट करें।',
  'home.hero.cta': 'चैट रूम बनाएं',
  'home.hero.live': 'LIVE: निजी सत्र',
  'home.discover.title': 'नए दोस्त बनाएं',
  'home.discover.subtitle': 'चैट करने के लिए उन्हें फ़ॉलो करें या संदेश भेजें।',
  'home.discover.message': 'संदेश',
  'home.finalCta.cta': 'चैट रूम बनाएं',

  // --- Auth ---
  'auth.login': 'लॉग इन करें',
  'auth.signup': 'खाता बनाएं',
  'auth.email': 'ईमेल',
  'auth.password': 'पासवर्ड',
  'auth.displayName': 'आपका नाम',
  'auth.haveAccount': 'पहले से खाता है?',
  'auth.noAccount': 'खाता नहीं है?',

  // --- Profile ---
  'profile.follow': 'फ़ॉलो करें',
  'profile.following': 'फ़ॉलो कर रहे हैं',
  'profile.message': 'संदेश',
  'profile.messageCta': 'चैट करने के लिए उन्हें संदेश भेजें',
  'profile.followers': 'फ़ॉलोअर्स',
  'profile.followingCount': 'फ़ॉलोइंग',
  'profile.editProfile': 'प्रोफ़ाइल संपादित करें',
  'profile.memberSince': '{date} से tiptalk.chat पर',
  'profile.gallery': 'गैलरी',
  'profile.privatePhoto': 'निजी फ़ोटो',
  'profile.notFound.title': 'प्रोफ़ाइल नहीं मिली',
  'profile.notFound.body': 'यह उपयोगकर्ता मौजूद नहीं है या अब उपलब्ध नहीं है।',

  // --- Messages / composer ---
  'msg.composer.title': 'इनके लिए संदेश',
  'msg.composer.label': 'आपका संदेश',
  'msg.composer.placeholder': 'चैट शुरू करने के लिए {name} को लिखें…',
  'msg.composer.send': 'संदेश भेजें',
  'msg.composer.sent.title': 'संदेश भेजा गया!',
  'msg.composer.sent.body': '{name} को ईमेल पर सूचना मिलेगी ताकि वे आकर आपको जवाब दें।',
  'msg.inbox.title': 'संदेश',
  'msg.inbox.empty': 'अभी तक कोई संदेश नहीं',
  'msg.inbox.reply': 'अपना जवाब लिखें…',

  // --- Wallet ---
  'wallet.title': 'वॉलेट',
  'wallet.balance': 'बैलेंस',
  'wallet.buy': 'Tipsys खरीदें',
  'wallet.payout.request': 'भुगतान का अनुरोध करें',
  'wallet.activate': 'भुगतान सक्रिय करें',

  // --- Room / chat ---
  'chat.send': 'भेजें',
  'chat.placeholder': 'संदेश लिखें…',
  'chat.guestCta.q': 'चैट पसंद आ रही है?',
  'chat.guestCta.link': 'मुफ़्त में साइन अप करें',
  'chat.guestCta.rest': 'अपनी प्रोफ़ाइल सहेजने, दूसरों को फ़ॉलो करने और अपने दोस्तों के संपर्क में रहने के लिए।',

  // --- Create room page ---
  'create.title': 'रूम बनाएं',
  'create.creatingAs': 'आप {name} के रूप में बना रहे हैं।',
  'create.logout': 'लॉग आउट करें',
  'create.toCreateAnon': 'बिना खाते के बनाने के लिए।',
  'create.anonDisclaimer': 'आपको खाते की ज़रूरत नहीं है। बस अपना निकनेम और रूम का नाम डालें।',
  'create.yourNick': 'आपका निकनेम',
  'create.nickPlaceholder': 'आपका नाम क्या है?',
  'create.roomName': 'रूम का नाम',
  'create.roomPlaceholder': 'मार्ता की पार्टी',
  'create.sessionExpired': 'आपका सत्र समाप्त हो गया है। फिर से लॉग इन करें या रूम को अतिथि के रूप में बनाएं।',
  'create.error': 'रूम नहीं बनाया जा सका। फिर से कोशिश करें।',
  'create.login': 'लॉग इन करें',
  'create.ready.title': 'आपका रूम तैयार है!',
  'create.ready.subtitle': 'इस लिंक को उन सभी के साथ साझा करें जिन्हें आप आमंत्रित करना चाहते हैं।',
  'create.ready.linkLabel': 'रूम लिंक',
  'create.ready.copied': 'कॉपी हो गया',
  'create.ready.copy': 'कॉपी करें',
  'create.ready.enter': 'अपने रूम में प्रवेश करें',

  // --- Legacy keys (kept for existing t() callers) ---
  'landing.title': 'आमने-सामने निजी चैट रूम',
  'landing.subtitle': 'एक रूम बनाएं, लिंक साझा करें और टिप्स पाएं।',
  'landing.cta.create': 'रूम बनाएं',
  'landing.cta.join': 'रूम में शामिल हों',
  'create.name': 'रूम का नाम',
  'create.submit': 'रूम बनाएं',
  'tip.send': 'Tipsy भेजें',
  'wallet.payout.min': 'न्यूनतम {min} Tipsys',
};
