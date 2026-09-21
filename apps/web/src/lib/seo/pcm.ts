import type { SeoPage } from '../seo-pages';

// ===== Reusable FAQ snippets (Naija / Nigerian Pidgin) =================
const FAQ_REGISTRO_PCM = {
  q: 'I go need register before I fit use tiptalk.chat?',
  a: 'No be so. You fit create room with just nick and name, and di other person go enter from di link without opening account. Na only if you wan collect tips and cash am comot go your account you go need register.',
};

const FAQ_PRIVACIDAD_PCM = {
  q: 'Wetin dey happen to my messages when di room close?',
  a: 'When you close di room (or 24 hours pass), we go delete all di messages, foto and video wey person don upload. Nothing dey remain for our server except di tip transaction record wey we must keep because of tax matter.',
};

const FAQ_PRECIO_PCM = {
  q: 'How much e cost to create room?',
  a: 'To create room na free and e go always be free. Na only tips you dey pay for, because na real money wey dey move from one person go another. If na to just chat and call you wan do, you no go pay anything.',
};

const FAQ_MOVIL_PCM = {
  q: 'E dey work for phone?',
  a: 'Yes, and you no need install any app. Di room dey open for your phone browser (Chrome, Safari, Firefox) just like any website. Di calls dey use di phone mic and camera.',
};

const FAQ_PROPINAS_PCM = {
  q: 'How di tips dey take work?',
  a: 'Di tips na Tipsys we dey call am. 1€ na 8 Tipsys when you buy. When person send you Tipsys, e dey gather for your wallet, and you fit change am to euro anytime you wan cash out (10 Tipsys = 1€ for di change back to euro).',
};

const FAQ_NAVEGADOR_PCM = {
  q: 'Na which browser e dey work for?',
  a: 'E dey work for Chrome, Safari, Firefox, Edge and Brave wey you don update. For video call, di browser go ask for permission to use your camera and mic di first time.',
};

export const pcm: Record<string, Partial<SeoPage>> = {
  'chat-online': {
    label: 'Online chat',
    h1: 'Live online chat',
    metaTitle: 'Online chat - Private chat room dem - Tiptalk',
    metaDescription:
      'Live online chat. Open your own private room and start to yarn anybody you like for seconds. You no need install anything.',
    intro:
      'A simple **online chat** wey private and no need download. You open di room, share di link, and di gist go start.',
    paragraphs: [
      'For tiptalk.chat you fit open **online chat** for seconds. No download, no phone number, no waiting. You just type di room name, press create, and your link don ready make you share am with anybody you want.',
      'E dey work from phone browser or computer, e no matter which one. Na only you and di person for di other side dey inside di gist — no big group, no stranger wey go just enter come surprise you. Whatever happen inside your **online chat** go remain between una two.',
      'If you tire for text, you fit start voice call or video call with just one button. Di call quality dey adjust to your network: if your line dey weak, e go keep di voice and reduce di resolution so di call no go cut.',
      'And if person dey tell you something wey sweet, you fit dash dem tips live. Di animation go show for screen sharp-sharp so di other person go see say you appreciate am without you talk anything.',
      'Different from WhatsApp group or Discord server, wetin you send no dey save forever. When you close di room (or 24 hours pass) everything go clear: messages, foto and video. Di idea be say di **online chat** go be like voice gist — e dey alive as e dey happen, and nothing more.',
      'We build am for people wey need fast place to talk to person without passing through social media. Private lesson, quick question, small gist with person wey you meet outside, or call with family wey dey far.',
      'No limit dey for how many room you fit create. If one room don full with plenty gist and you wan start fresh, you go open another one for thirty seconds and share di new link.',
    ],
    faqs: [
      {
        q: 'I fit use tiptalk.chat as **online chat** for my business?',
        a: 'Yes. Plenty people dey use am for client matter, private lesson or coaching. Di room private, di pay dey go through tips or one flat price wey you talk before, and when una finish nothing go remain.',
      },
      {
        q: 'How many people fit enter one **online chat**?',
        a: 'Na one-on-one we design am. Di room dey hold di person wey create am and whoever get di link, wey give you private gist of two people. If you need more, you fit open plenty room at di same time.',
      },
      FAQ_REGISTRO_PCM,
      FAQ_PRIVACIDAD_PCM,
      FAQ_MOVIL_PCM,
    ],
  },
  'chat-propinas': {
    label: 'Tips chat',
    h1: 'Chat wey get tips inside',
    metaTitle: 'Tips chat - Make money as you dey chat - Tiptalk',
    metaDescription:
      'Private chat wey get tips inside. Collect tips from your people for every gist. Create your room free and start now.',
    intro:
      'For tiptalk.chat di **tips** dey inside di chat. One button, one amount, and e go show for screen sharp-sharp.',
    paragraphs: [
      'Di sweet part of tiptalk.chat be say any gist fit turn to **tips** chat. If dem dey make you laugh, if dem dey help you, or you just wan appreciate di other person time, button dey. You no need change app, you no need open bank app, you no need jump go another tab.',
      'E dey run with Tipsys, our virtual money. 1€ na 8 Tipsys when you buy, and 10 Tipsys na 1€ when you cash out. Whoever collect **tips** go gather am for im wallet and fit change am to euro once e reach di payout minimum.',
      'E direct — no wahala gateway, no jumping go another app. You press button, choose amount, and animation go show for di chat so di other person go see am immediately. No confirmation wey go later come, no email say you don receive money.',
      'Preset tips dey (0.25 €, 0.50 €, 1 €, 2 €, 5 €) and option to put your own amount. If you wan add small note with di tip, e go go by di side: thank you, joke, anything.',
      'When you collect plenty **tips** for one gist, all of dem go show for your wallet as separate entry. Dat one go give you clear history: you fit see when each one land and which room e come from.',
      'To start to collect, na only sign up you go do (e no reach one minute), connect payout account and open room. Wetin remain after na to dey chat: di platform go handle di rest.',
      'Di system dey work well for creators wey get big audience and for professionals wey dey give quick consultation. If na conversation dem dey take measure your work, to get **tips** inside di chat go reduce di wahala to di smallest.',
    ],
    faqs: [
      {
        q: 'Who dey pay di commission for **tips** chat?',
        a: 'Na di person wey collect di tip dey carry di commission (30%). Di person wey give di tip go pay exactly wetin e see for screen without any extra charge — di amount wey e offer na di euro wey go land.',
      },
      {
        q: 'Wetin be di minimum to withdraw tips go my account?',
        a: 'Di payout minimum na 300 Tipsys, wey be 30 € gross before commission. Once you pass dat mark, you fit request payout as many times as you want.',
      },
      FAQ_PROPINAS_PCM,
      FAQ_REGISTRO_PCM,
      FAQ_PRIVACIDAD_PCM,
    ],
  },
  'chat-movil': {
    label: 'Phone chat',
    h1: 'Chat for phone',
    metaTitle: 'Phone chat - Private chat - Tiptalk',
    metaDescription:
      'Private chat wey dem build for phone. Text, voice and video from di browser. No download. Share di link and chat now.',
    intro:
      'tiptalk.chat dey work as **phone chat** wey no need app: di room dey open for Safari or Chrome and you don enter.',
    paragraphs: [
      'tiptalk.chat, na for phone we build am. Di room dey open from Safari, Chrome or any browser wey you dey use, just like when you open any website. No app to download, no update, no strange permission: na just one more tab.',
      'You fit send messages, foto, short video and start call with di front camera or di mic. All from di same place. If you decide to do video call, di browser go ask for camera permission di first time and after e go remain granted for dat room.',
      'No app to install and no strange notification. If you close di tab, di gist go still dey there as long as di room dey open. You go enter back from di link and continue where you stop.',
      'Di **phone chat** interface dey adjust to di screen: di messages dey fill di useful width, di keyboard dey adjust by itself, and di call buttons dey where your thumb fit reach for di top right.',
      'As you dey for video call, di chat go still dey active for down. You fit see messages wey dey enter without you cut di call, and di person for di other side go see wetin you dey type as you dey talk. E good to pass link, address or number without you lose di flow.',
      'Di calls for **phone chat** dey work with data or WiFi, and dem dey adjust to di network quality. If your 4G weak, e go reduce di video resolution by itself so di voice no go cut. And if you lose di connection, e go reconnect by itself when you come back.',
      'E dey work di same from iPhone and from Android. Di only condition na to get browser wey you don update: nothing strange, all di phones of di last few years fit do am.',
    ],
    faqs: [
      {
        q: 'I go need install app to use di chat for phone?',
        a: 'No. Di whole experience dey work from di browser. No native version dey because e no dey necessary: di video calls, di tips and di foto dey work well from di web.',
      },
      {
        q: '**Phone chat** with video dey waste plenty data?',
        a: 'Standard video call dey use between 5 and 10 MB per minute. If your data dey small, you fit off di camera and leave only di voice, wey dey drop go less than 1 MB per minute.',
      },
      FAQ_NAVEGADOR_PCM,
      FAQ_REGISTRO_PCM,
      FAQ_PRIVACIDAD_PCM,
    ],
  },
  'chatroulette': {
    label: 'ChatRoulette',
    h1: 'Alternative to ChatRoulette',
    metaTitle: 'ChatRoulette - Private chat - Tiptalk',
    metaDescription:
      'Private one-on-one chat room. Na you dey choose who you go talk to — no surprise. Modern alternative to ChatRoulette wey dey for Spanish.',
    intro:
      'If you land here dey find **ChatRoulette**, tiptalk.chat na di controlled version: na you dey decide who go enter, no random stranger.',
    paragraphs: [
      'If you land here dey find something like **ChatRoulette**, wetin tiptalk.chat dey do resemble am but e different: na you dey decide who you go talk to. You open di room and share di link with di person or people wey you wan put inside.',
      'No roulette, no random stranger. Na private one-on-one room, na you dey control am. If somebody dey worry you, you close am and open another one. Di key difference from classic **ChatRoulette** be say na you dey choose here, no be luck.',
      'Dat one dey avoid di normal wahala of chat roulette: people wey dey connect without camera, content wey you no want, gist wey dey last three seconds. Here di room na your own and na only whoever you decide go enter.',
      'If your plan na to meet new people, you go just share di link for forum, for social media or anywhere you like. Whoever dey interested go find you. You still dey control who dey enter and when.',
      'E dey work for any device wey get browser and you get video, voice, text and tips for di same place. E be like **ChatRoulette** but dem build am for 2026: no download, no Flash, no need sign up for anything.',
      'For creators wey dey come from camera platform, tiptalk.chat dey offer something wey dem no get: live tips inside di chat. Na you dey decide when you open and close, no contract, no fixed fee.',
      'If your room get traffic, di Tipsys wey you collect you go change am to euro anytime. Di management dey much cleaner pass any classic roulette, where di way to make money been confuse or even no dey exist.',
    ],
    faqs: [
      {
        q: 'tiptalk.chat na like **ChatRoulette**?',
        a: 'E share di idea of one-on-one video chat, but no be di roulette. Here na you dey share di link of your room with whoever you want, instead of make di system match you with random stranger.',
      },
      {
        q: 'I fit open public room like **ChatRoulette**?',
        a: 'You fit share di link anywhere you like (forum, social media, profile) and anybody wey get dat link go enter your room. You still dey control di access because you fit close am anytime or put PIN for am.',
      },
      FAQ_REGISTRO_PCM,
      FAQ_PRIVACIDAD_PCM,
      FAQ_MOVIL_PCM,
    ],
  },
  'chat-amigos': {
    label: 'Chat with padi',
    h1: 'Chat to yarn with padi',
    metaTitle: 'Chat with padi - Private chat room dem - Tiptalk',
    metaDescription:
      'Private chat to yarn with padi. Text, voice and video from di browser. No big group, no notification, na only you and whoever you want.',
    intro:
      '**Chat with padi** without adding more noise to WhatsApp. Private room, voice, video and nothing wey go remain save.',
    paragraphs: [
      'Sometimes you no wan put one gist for WhatsApp, or make e remain there forever. tiptalk.chat go give you private room wey dey exist only as long as you wan keep am open. We design am for **chat with padi** wey no go spoil your other chats.',
      'You fit put one padi, share foto and video, call by voice or do video call. When una finish, you close di room and everything wey una send inside go clear. No history go hang for your phone or im own.',
      'E good to arrange plans, for long call with person wey dey far, or just to get one quiet place to yarn. Since no big group dey, notification no go dey enter every two minutes come comot you from di matter.',
      'If you arrange with one padi wey dey another country and di time difference give una short window to talk, to open **chat with padi** for tiptalk.chat go solve am: she go enter from one link, you from another, and una go start to yarn without downloading anything.',
      'For long call, di system dey keep di connection even if one of una change from WiFi go 4G for di middle of di gist. Di quality go drop small and come back, without say una go call again.',
      'Since account no dey necessary, you fit invite person wey no wan install another app. Na only di link e need. E go put im name, enter, and e don dey inside.',
      'E dey extra useful when another channel (partner, cousin, work) don get plenty noise already. To open separate **chat with padi** dey let you no mix di gist together.',
    ],
    faqs: [
      {
        q: 'My padi dem go need create account to enter di chat?',
        a: 'No. Na only di link wey you share dem need. When dem enter, e go ask dem for nick to identify dem for di room and na so.',
      },
      {
        q: 'I fit create plenty room at di same time for different padi group?',
        a: 'Yes. Each room dey independent and e dey live only as long as you keep am open. You fit get one with school padi, another with gym people and another with family, without dem to mix.',
      },
      FAQ_REGISTRO_PCM,
      FAQ_PRIVACIDAD_PCM,
      FAQ_MOVIL_PCM,
    ],
  },
  'chat-privado': {
    label: 'Private chat',
    h1: 'Private chat for one-on-one',
    metaTitle: 'Private chat - Private chat - Tiptalk',
    metaDescription:
      'Private chat one-on-one with video, voice and tips. You open di room, share di link and na only whoever you decide go enter.',
    intro:
      'A real **private chat**: one-on-one room, no history wey dey save, with video and tips for di same place.',
    paragraphs: [
      'tiptalk.chat na basically **private chat** like di old ones, but dem arrange am better. Na you dey decide who go enter: if you no get di link, you no fit reach di room. And even if you get di link, if di creator close am, e go stop to work.',
      'By default, nothing wey happen inside dey save when you close. We dey delete di messages and di files when di gist finish, and after 24 hours di room go close by itself. Na di difference with any social media: here wetin you send no dey train anything and no dey remain for server forever.',
      'If you want more privacy still, you fit put **PIN** for di room so di link alone no go enough. So even if person copy and share di link, dem no go fit enter without di code.',
      'Di **private chat** dey support text, foto, short video, voice call and video call. All for di same room. If you move from chat go video and come back, nothing go fall: e still be di same thread.',
      'Different from di chats wey dey inside social media, here no advert dey, no recommendation, no suggestion of people wey you fit know. Na only di chat. Di company no dey make money from your gist — e dey make money from di tips, and na only if you decide to use dem.',
      'For technical privacy: di connections dey go through TLS, di files dey pass through encrypted storage and di payment webhooks dey follow Stripe Connect standard. No be magic or empty promise: na di standard stack wey dem configure well.',
      'When you close room, one process dey run wey go clean everything wey concern am: media for storage, messages for database and di room itself. Di only thing wey dey survive na di tips ledger, wey be accounting record wey dem must keep.',
    ],
    faqs: [
      {
        q: 'tiptalk.chat na really **private chat**?',
        a: 'Yes. Na only whoever get di link (and di PIN if you turn am on) fit reach di room. Di content dey delete when you close. We no dey show di rooms for any public list.',
      },
      {
        q: 'Di **private chat** dey encrypted from end to end?',
        a: 'Di connections dey use TLS from end to end, browser to server, but di messages dey pass through our backend so dem fit share am to di people wey suppose receive. E no be pure E2EE like Signal, but di content dey delete when di room close.',
      },
      FAQ_REGISTRO_PCM,
      FAQ_PRIVACIDAD_PCM,
      FAQ_NAVEGADOR_PCM,
    ],
  },
  'chat-token': {
    label: 'Token chat',
    h1: 'Chat with token — Tipsys',
    metaTitle: 'Token chat - Make money as you dey gist - Tiptalk',
    metaDescription:
      'Chat room with token system (Tipsys). Collect live tips from your people. Change your token to euro anytime you want.',
    intro:
      'tiptalk.chat dey work like **token** chat: inside na Tipsys, outside na euro. You buy, you send, you withdraw.',
    paragraphs: [
      'Di **token** for tiptalk.chat, na Tipsys we dey call am. Di change dey simple: 1€ na 8 Tipsys when you buy. When you cash out, 10 Tipsys na 1€ (di difference na di commission wey dey maintain di platform).',
      'When person send you Tipsys, e dey gather for your wallet. When you reach di minimum (300 Tipsys = 30 € gross), you change am to euro and withdraw am go your bank account. Di payout dey pass through our payment provider and normally e dey land for 1-2 working days.',
      'Wetin you dey see inside di **token** chat direct: each tip dey show as small animation immediately. No waiting, no end-of-month settlement, no invoice wey lock for inbox.',
      'Di **token** perfect for creators because e dey separate di decision to support person from di decision to enter your card again. Your people go buy pack and after go dey drop tips with one click, without passing di gateway again.',
      'Pack dey for 40 (5 €), 80 (10 €), 160 (20 €) and 400 (50 €) Tipsys. Di bigger di pack, di easier for your people to keep di habit without reloading every time. If somebody want another amount, na you go decide: di room dey accept free amount.',
      'Since di **token** chat na di platform own, no risk dey say payout go fail because of wahala with external gateway. If you get Tipsys for your wallet, na your own.',
      'For tax matter: di withdrawals dey go your account and na personal income wey dey under IRPF for Spain (or equivalent for your country). We dey give you monthly summary for your panel so e go easy to declare am.',
    ],
    faqs: [
      {
        q: 'Wetin be Tipsys, di internal **token** of tiptalk.chat?',
        a: 'Na our virtual tips money. 1€ na 8 Tipsys when you buy, 10 Tipsys na 1€ when you cash out. Di difference na di platform commission (30%).',
      },
      {
        q: 'Di Tipsys for wallet dey expire?',
        a: 'No, di Tipsys wey you get for your wallet dey stay forever. You fit send dem as tips or withdraw dem for euro when you reach di minimum.',
      },
      FAQ_PROPINAS_PCM,
      FAQ_PRECIO_PCM,
      FAQ_REGISTRO_PCM,
    ],
  },
  'chat-tips': {
    label: 'Live tips chat',
    h1: 'Chat with live tips',
    metaTitle: 'Live tips chat - Make money as you dey chat - Tiptalk',
    metaDescription:
      'Collect tips direct inside di chat. Voice, video and tips for di same room. No external gateway, no waiting.',
    intro:
      'Di **tips** for tiptalk.chat dey inside di chat. Button, amount, animation and done.',
    paragraphs: [
      'One **tip** for tiptalk.chat na something wey di person for di other side fit send you without comot from di chat. E press button, choose how much, and di animation go show immediately. You go see am live and di other person go comot with di feeling say e don appreciate di time.',
      'E much more direct pass separate bank transfer or PayPal wey you open for another tab. Di **tips** chat dey put di tip as another message, with im visual animation and im entry for di wallet.',
      'E good di same for creators, for professionals wey dey charge quick consultation, or for padi wey wan buy you something from far. Di economy na di same: Tipsys wey dey gather and dey turn to euro.',
      'For di creator, to collect **tips** inside di chat get advantage over di pay-at-di-end model: dem dey give di tip hot, just after di moment wey make you talk thank you. Dat one dey psychologically easier pass to open another app to send 2 € cold.',
      'Di tip animation dey discreet — e no dey interrupt or cover di chat. E dey show for just two seconds like emoji wey dey fly, and e go register for di history as system message.',
      'For cases where you wan talk thank you for something specific — one useful answer, one joke — you fit drop **tip** on top di exact message. So you go sabi wetin di tip concern when you later check your history.',
      'No low minimum dey: di smallest **tip** na 0.25 € (2 Tipsys). Di highest na free — di person go choose di amount. If your room dey move well, di average ticket dey usually between 0.50 € and 2 €.',
    ],
    faqs: [
      {
        q: 'I go pay to send **tip** for chat?',
        a: 'To send tips, you go first buy Tipsys (1€ = 8 Tipsys) and dey send dem with one click during di gist. No extra cost dey for individual tip; di cost na to buy Tipsys.',
      },
      {
        q: 'I fit send **tips** to plenty people at di same time?',
        a: 'Your wallet na one and di Tipsys wey you get dey work for any room. If you open plenty room, you fit dey send tips for each one with di same balance.',
      },
      FAQ_PROPINAS_PCM,
      FAQ_PRECIO_PCM,
      FAQ_PRIVACIDAD_PCM,
    ],
  },
  'chatear-online': {
    label: 'Chat online',
    h1: 'Chat online for Spanish',
    metaTitle: 'Chat online - Private chat room dem - Tiptalk',
    metaDescription:
      'Chat online for Spanish. Private room with text, voice and video from di browser. Share di link and start now.',
    intro:
      'To **chat online** for Spanish without downloading anything: you open room, share link, una dey yarn.',
    paragraphs: [
      'To **chat online** for tiptalk.chat na to open room with one name, share di link and done. Dem no dey ask for account, dem no dey ask for phone, dem no dey ask for SMS verification. You go straight enter di chat.',
      'Di room na only your own and whoever you decide to invite. If you wan move from text go video or voice, e dey inside di same place: two buttons for di top left. You no need open Skype, Google Meet or Zoom.',
      'After 24 hours e go close by itself and everything wey una send inside go disappear. If you want more time, you go just open another one. Dis one good for gist wey you no want make e gather for your general history.',
      'To **chat online** with person wey dey di other side of di world, na only good internet you need. Di latency dey stay low because we dey choose call server based on where una two dey.',
      'Different from other **chat online** websites, here di tips na natural part of di flow. If you enjoy di time with person, you talk am with one button. If dem dey help you, you appreciate am without opening another app.',
      'Di interface dey for Spanish, di system messages dey for Spanish, di emoji and sticker dey handle for Spanish. No clumsy translation, no button wey half dey for English. Dem design am for Spanish speakers.',
      'If na one-time gist you wan enter, you no even need drop your real name. You put any nick and you don dey inside.',
    ],
    faqs: [
      {
        q: 'How many people fit **chat online** at di same time for one room?',
        a: 'Di room na for one-on-one (two people). If you need to chat online with more people, e better to open plenty room or use another kind of tool.',
      },
      {
        q: 'E dey work to **chat online** between different countries?',
        a: 'Yes. Di calls dey route through servers for Europe, US and South America, so di latency dey stay low no matter di destination. Messages and tips dey travel immediately.',
      },
      FAQ_REGISTRO_PCM,
      FAQ_MOVIL_PCM,
      FAQ_NAVEGADOR_PCM,
    ],
  },
  'chat-en-espanol': {
    label: 'Spanish chat',
    h1: 'Spanish chat',
    metaTitle: 'Spanish chat - Private chat room dem - Tiptalk',
    metaDescription:
      'Spanish chat without registration, without install. Private room with video, voice and tips. For Spanish speakers from anywhere.',
    intro:
      '**Spanish chat** for Spanish speakers — di interface, di messages and di emoji. Dem plan everything for you.',
    paragraphs: [
      'tiptalk.chat dey work fully for Spanish. Di interface, di alerts, di form to create room. Dem plan everything for whoever dey speak Spanish no matter di country. E no be half translation: dem write am for Spanish from di start.',
      'Since di room dey share by link, e no matter if di other person dey another time zone. Di two go connect, talk and close. Di difference with other chats be say here you no need fight with menu wey AI translate or instruction wey remain for English.',
      'E good di same to yarn with family, for private lesson remote, to talk with person wey you meet for another network, or to give consultation with tips. Di **Spanish chat** dey fit any use because di tools na di same: text, voice, video, tips.',
      'For Spanish-speaking creators, to open your own **Spanish chat** dey solve one common wahala: plenty big platform na American and di payment system no dey accept Spanish or Latin American account easily. Here di payout dey go European and American accounts without trick.',
      'Di virtual money (Tipsys) dey show for euro because na di natural thing for Spain. If you dey Latin America, you fit convert am for mind: 1€ na 8 Tipsys roughly. Di withdrawals fit go accounts for plenty country.',
      'Di system messages inside di room dey for Spanish too: “Carlos don enter di room”, “Room don close by di host”, “Dem don send you tip of 2 €”. Small-small details wey dey make di experience consistent.',
      'No country restriction dey to open room. You fit dey Madrid, Buenos Aires, CDMX or Caracas. Di service dey work di same and we dey choose di servers to reduce di latency from where you dey.',
    ],
    faqs: [
      {
        q: 'Di **Spanish chat** dey work from Latin America?',
        a: 'Yes, no restriction. Di call servers dey share between Europe, US and South America, so di quality dey stay good no matter di country.',
      },
      {
        q: 'I fit collect tips for my **Spanish chat** if I dey Mexico or Argentina?',
        a: 'Yes, as long as you get bank account wey dey accept international transfer. Di withdrawal dey pass through Stripe Connect, wey dey operate for most Spanish-speaking countries.',
      },
      FAQ_REGISTRO_PCM,
      FAQ_PRECIO_PCM,
      FAQ_PRIVACIDAD_PCM,
    ],
  },
  'chat-espana': {
    label: 'Spain chat',
    h1: 'Chat for Spain',
    metaTitle: 'Spain chat - Private chat - Tiptalk',
    metaDescription:
      'Private chat for Spain, for Spanish. HD video and voice from di browser. Create your room free and share di link.',
    intro:
      'A simple **Spain chat**: no download, for Spanish, with servers for Europe so e go dey fast.',
    paragraphs: [
      'If you dey Spain and you want **Spain chat** room without downloading any app, tiptalk.chat go open am for you for seconds. E dey work for any phone, any computer, with any modern browser.',
      'You no need register or drop your number. You put nick, put di room name and you don get di link to share. Di people wey enter from di link fit come as guest too — without forcing dem to register.',
      'Di calls dey travel through servers for Europe, so di latency dey low between Spain and most of di continent. Madrid-Barcelona call dey move near there, no be California like other services.',
      'For creators for **Spain chat**, di platform dey accept Spanish and European bank account without extra. Di tips withdrawal dey land as normal transfer go your bank account.',
      'Di Tipsys (di virtual money) dey for euro, wey be di money wey make sense for Spanish users. No strange conversion: if you collect 50 € for Tipsys, you withdraw 50 € (minus commission).',
      'For compliance matter, tiptalk.chat dey operate under EU law — GDPR for personal data, VAT where e apply, digital services rules. E no be shady service for di side: na Spanish business with im papers correct.',
      'For personal use for **Spain chat** — call with padi, lesson, gist with person wey you meet for another network — e dey work just like dat. No account, no anything.',
    ],
    faqs: [
      {
        q: 'I fit collect tips for my Spanish bank account?',
        a: 'Yes. Di withdrawals dey pass through Stripe Connect, wey dey accept Spanish account (IBAN) without wahala. Di money dey land as SEPA transfer for 1-2 working days.',
      },
      {
        q: 'I go pay VAT for di tips wey I collect?',
        a: 'Di tips na personal income and, as such, dem dey tax am for IRPF. Di VAT dey depend on whether you register as self-employed or not. For occasional use without invoice, no VAT dey involved.',
      },
      FAQ_REGISTRO_PCM,
      FAQ_PRECIO_PCM,
      FAQ_PRIVACIDAD_PCM,
    ],
  },
  'chat-hablahispana': {
    label: 'Spanish-speaking chat',
    h1: 'Chat for di Spanish-speaking community',
    metaTitle: 'Spanish-speaking chat - Private chat room dem - Tiptalk',
    metaDescription:
      'Chat room for di Spanish-speaking community. Spain and Latin America for di same place, no registration, with video and tips.',
    intro:
      '**Spanish-speaking people** without barrier: Spain, Mexico, Argentina, Colombia, Chile, all for di same room.',
    paragraphs: [
      'Dis one na for di **Spanish-speaking people** in general — Spain, Mexico, Argentina, Colombia, Chile and everything wey dey between. E no matter where you come from: di room na di same for everybody.',
      'tiptalk.chat dey load fast from any Spanish-speaking country. Di video servers dey choose di nearest one and di voice dey stay clear. Mexico-Spain gist dey pass through optimized transatlantic servers, no be one single point for di middle wey go add latency.',
      'If you organize something between people from plenty country, you go just share di link and everybody go reach di same place without installing anything. Na di advantage of being web: e no matter which phone each person dey use.',
      'Di chat for **Spanish-speaking people** dey extra useful for creators wey get audience wey spread. If you get followers for plenty Spanish-speaking country, to open room dey give dem common meeting point without fighting platform wey dey work for only one.',
      'Di tips for euro dey easy to understand from Spain, but di Latin American users dey see am and convert am for mind to dem local money. Di conversion to peso/dollar/bolivar/sol dey depend on di bank wey issue am when dem do di payment.',
      'For tone matter, di platform dey use neutral Spanish: “tú” as pronoun, verb forms wey dem understand for Spain and Latin America, without too regional slang. Di idea be say e go comfortable for any Spanish speaker.',
      'For gist between two people of different country, di chat for **Spanish-speaking people** dey work just like any other room: text, voice, video and tips. Di geographical distance no dey affect wetin you fit do inside.',
    ],
    faqs: [
      {
        q: 'I fit open chat for **Spanish-speaking people** with people from different country?',
        a: 'Yes. Di room dey accept whoever get di link, no matter where dem connect from. Di calls dey route to reduce di latency even if di participants dey different continent.',
      },
      {
        q: 'Di tips money dey work for Latin America?',
        a: 'Di tips dey handle for Tipsys, wey be euro (1€ = 8 Tipsys). Whoever buy Tipsys from Latin America go pay di equivalent for im local money based on di exchange of di moment.',
      },
      FAQ_REGISTRO_PCM,
      FAQ_PRIVACIDAD_PCM,
      FAQ_NAVEGADOR_PCM,
    ],
  },
};
