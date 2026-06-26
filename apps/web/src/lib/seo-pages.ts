/**
 * SEO landing-page catalog. Each entry powers a /c/<slug> route AND a link
 * in the homepage footer. Copy is in natural Spanish; keep it short, simple
 * and never sounding generated. A page renders the same chrome (header +
 * footer) with a top CTA to /create + a few paragraphs of body text.
 *
 * Metatitle pattern (alternated per page so we don't repeat):
 *   <Keyword> - Ganar dinero chat - Tiptalk
 *   <Keyword> - Ganar dinero chateando - Tiptalk
 *   <Keyword> - Salas chat privadas - Tiptalk
 *   <Keyword> - Chat privado - Tiptalk
 */

export interface SeoPage {
  slug: string;
  /** Short label used in the footer link */
  label: string;
  /** H1 shown at the top of the page */
  h1: string;
  /** <title> */
  metaTitle: string;
  /** <meta name="description"> */
  metaDescription: string;
  /** 3-5 short paragraphs, plain strings (rendered with <p>) */
  paragraphs: string[];
}

export interface SeoColumn {
  title: string;
  slugs: string[];
}

const T = {
  ganarDinero: 'Ganar dinero chat',
  ganarDineroIng: 'Ganar dinero chateando',
  salas: 'Salas chat privadas',
  chatPrivado: 'Chat privado',
} as const;

function mt(kw: string, suffix: keyof typeof T): string {
  return `${kw} - ${T[suffix]} - Tiptalk`;
}

// === COLUMN 1: Features de chat =========================================
const features: SeoPage[] = [
  {
    slug: 'chat-online',
    label: 'Chat online',
    h1: 'Chat online en directo',
    metaTitle: mt('Chat online', 'salas'),
    metaDescription:
      'Chat online en directo en español. Crea una sala privada y empieza a hablar con quien quieras en segundos. Sin instalar nada.',
    paragraphs: [
      'En tiptalk.chat puedes abrir un chat online en segundos. No hay descargas, no hay número de teléfono, no hay esperas. Solo escribes el nombre de la sala y compartes el enlace con quien quieras.',
      'Funciona desde el navegador del móvil o del ordenador. Lo mismo da. La conversación es solo entre tú y la persona del otro lado.',
      'Si te apetece pasar del texto, lanzas una llamada de voz o una videollamada con un botón. Y si te están contando algo que merece la pena, puedes dejarles propinas en directo.',
    ],
  },
  {
    slug: 'chat-propinas',
    label: 'Chat propinas',
    h1: 'Chat con propinas',
    metaTitle: mt('Chat propinas', 'ganarDinero'),
    metaDescription:
      'Chat privado con propinas integradas. Recibe tips de tu audiencia en cada conversación. Crea tu sala gratis y empieza ya.',
    paragraphs: [
      'La gracia de tiptalk.chat es que cualquier conversación puede convertirse en una propina. Si te están haciendo reír, si te están ayudando, si simplemente quieres reconocer el tiempo de la otra persona, hay un botón.',
      'Funciona con Tipsys, nuestra moneda virtual. 1€ son 8 Tipsys. Quien recibe propinas las acumula en su monedero y puede convertirlas en euros cuando quiera.',
      'Es directo, sin pasarelas torpes ni saltos a otra app. Le das un botón y aparece una animación en el chat para que la otra persona lo vea de inmediato.',
    ],
  },
  {
    slug: 'chat-movil',
    label: 'Chat móvil',
    h1: 'Chat para el móvil',
    metaTitle: mt('Chat móvil', 'chatPrivado'),
    metaDescription:
      'Chat privado optimizado para móvil. Texto, voz y vídeo desde el navegador. Sin descargas. Comparte el enlace y chatea ya.',
    paragraphs: [
      'tiptalk.chat está pensado para el móvil. La sala se abre desde Safari, Chrome o el navegador que uses, igual que cuando abres cualquier web.',
      'Puedes mandar mensajes, fotos, vídeos cortos y empezar llamadas con la cámara delantera o el micro. Todo desde el mismo sitio.',
      'No hay app que instalar ni notificaciones extrañas. Si cierras la pestaña, la conversación sigue ahí mientras la sala esté abierta.',
    ],
  },
  {
    slug: 'chatroulette',
    label: 'ChatRoulette',
    h1: 'Alternativa a ChatRoulette',
    metaTitle: mt('ChatRoulette', 'chatPrivado'),
    metaDescription:
      'Sala de chat privada uno a uno. Tú eliges con quién hablas — sin sorpresas. Alternativa moderna a ChatRoulette en español.',
    paragraphs: [
      'Si llegas buscando algo tipo ChatRoulette, lo que tiptalk.chat hace es parecido pero distinto: tú decides con quién hablas. Tú abres la sala y compartes el enlace con la persona o personas que quieres meter dentro.',
      'No hay ruleta ni desconocidos al azar. Es una sala privada uno a uno, controlada por ti. Si te incomoda alguien, cierras y abres otra.',
      'Funciona en cualquier dispositivo con navegador y tienes vídeo, voz, texto y propinas en el mismo sitio.',
    ],
  },
  {
    slug: 'chat-amigos',
    label: 'Chat amigos',
    h1: 'Chat para hablar con amigos',
    metaTitle: mt('Chat amigos', 'salas'),
    metaDescription:
      'Chat privado para hablar con amigos. Texto, voz y vídeo desde el navegador. Sin grupos enormes ni notificaciones, solo tú y quien tú quieras.',
    paragraphs: [
      'A veces no quieres meter una conversación en WhatsApp, ni que quede ahí para siempre. tiptalk.chat te da una sala privada que existe solo mientras la quieras tener abierta.',
      'Puedes meter a un amigo, compartir fotos y vídeos, llamar por voz o hacer videollamada. Cuando termináis, cierras la sala y se borra todo lo que se ha mandado dentro.',
      'Sirve para cuadrar planes, para una llamada larga con alguien de fuera o simplemente para tener un sitio sin ruido donde charlar.',
    ],
  },
  {
    slug: 'chat-privado',
    label: 'Chat privado',
    h1: 'Chat privado para uno a uno',
    metaTitle: mt('Chat privado', 'chatPrivado'),
    metaDescription:
      'Chat privado uno a uno con vídeo, voz y propinas. Tú abres la sala, compartes el enlace y solo entra quien tú decidas.',
    paragraphs: [
      'tiptalk.chat es básicamente un chat privado de los de toda la vida, pero mejor montado. Tú eres quien decide quién entra: si no tienes el enlace, no llegas a la sala.',
      'Por defecto, nada de lo que pasa dentro queda guardado al cerrar. Borramos los mensajes y los archivos al terminar la conversación, y a las 24 horas la sala se cierra sola.',
      'Si quieres más privacidad todavía, puedes ponerle un PIN a la sala para que el enlace por sí solo no baste.',
    ],
  },
  {
    slug: 'chat-token',
    label: 'Chat token',
    h1: 'Chat con tokens — Tipsys',
    metaTitle: mt('Chat token', 'ganarDineroIng'),
    metaDescription:
      'Sala de chat con sistema de tokens (Tipsys). Recibe propinas en directo de tu audiencia. Convierte tus tokens en euros cuando quieras.',
    paragraphs: [
      'Los tokens de tiptalk.chat se llaman Tipsys. La conversión es sencilla: 1€ equivale a 8 Tipsys cuando se compran.',
      'Cuando alguien te manda Tipsys, se acumulan en tu monedero. Cuando llegas al mínimo, los conviertes en euros y los retiras a tu cuenta.',
      'Lo que ves dentro del chat es directo: cada propina aparece como una mini-animación al instante. Sin esperas, sin liquidaciones de fin de mes.',
    ],
  },
  {
    slug: 'chat-tips',
    label: 'Chat tips',
    h1: 'Chat con tips en directo',
    metaTitle: mt('Chat tips', 'ganarDinero'),
    metaDescription:
      'Recibe tips directamente en el chat. Voz, vídeo y propinas en la misma sala. Sin pasarelas externas, sin esperas.',
    paragraphs: [
      'Un tip en tiptalk.chat es algo que la persona que está al otro lado puede mandarte sin salir del chat. Le da a un botón, elige cuánto, y aparece la animación.',
      'Tú lo ves en directo y la otra persona se va con la sensación de haberte agradecido el rato. Es mucho más directo que un Bizum aparte o un PayPal abierto en otra pestaña.',
      'Sirve igual para creadores que para profesionales que cobran una consulta corta o para amigos que quieren invitarte a algo a distancia.',
    ],
  },
  {
    slug: 'chatear-online',
    label: 'Chatear online',
    h1: 'Chatear online en español',
    metaTitle: mt('Chatear online', 'salas'),
    metaDescription:
      'Chatear online en español. Sala privada con texto, voz y vídeo desde el navegador. Comparte el enlace y empieza ya.',
    paragraphs: [
      'Chatear online en tiptalk.chat es abrir una sala con un nombre, compartir el enlace y listo. No piden cuenta, no piden teléfono.',
      'La sala es solo tuya y de quien decidas invitar. Si quieres pasar del texto a vídeo o voz, ya está dentro del mismo sitio: dos botones arriba.',
      'A las 24 horas se cierra sola y todo lo que mandasteis dentro desaparece. Si quieres más tiempo, simplemente abres otra.',
    ],
  },
];

// === COLUMN 2: Español-focused ==========================================
const spanish: SeoPage[] = [
  {
    slug: 'chat-en-espanol',
    label: 'Chat en español',
    h1: 'Chat en español',
    metaTitle: mt('Chat en español', 'salas'),
    metaDescription:
      'Chat en español sin registro, sin instalar. Sala privada con vídeo, voz y propinas. Para hispanohablantes de cualquier parte.',
    paragraphs: [
      'tiptalk.chat funciona íntegramente en español. La interfaz, los avisos, el formulario para crear sala. Todo está pensado para quien habla castellano sin importar el país.',
      'Como la sala se comparte por enlace, no importa si la otra persona está en otra zona horaria. Se conectan los dos, hablan y cierran.',
      'Sirve igual para charlar con familia, para una clase particular en remoto, para hablar con alguien que conociste en otra red, o para dar consultas con propinas.',
    ],
  },
  {
    slug: 'chat-espana',
    label: 'Chat España',
    h1: 'Chat para España',
    metaTitle: mt('Chat España', 'chatPrivado'),
    metaDescription:
      'Chat privado en español para España. Vídeo y voz HD desde el navegador. Crea tu sala gratis y comparte el enlace.',
    paragraphs: [
      'Si estás en España y quieres una sala de chat sin descargar ninguna app, tiptalk.chat te la abre en segundos. Funciona en cualquier móvil, en cualquier ordenador, con cualquier navegador moderno.',
      'No hace falta darse de alta ni dejar el número. Pones un nick, pones el nombre de la sala y ya tienes el enlace para compartir.',
      'Las llamadas viajan por servidores en Europa, así que la latencia es baja entre España y la mayor parte del continente.',
    ],
  },
  {
    slug: 'chat-hablahispana',
    label: 'Chat habla hispana',
    h1: 'Chat para la comunidad hispana',
    metaTitle: mt('Chat habla hispana', 'salas'),
    metaDescription:
      'Sala de chat para la comunidad hispanohablante. España y Latinoamérica en el mismo sitio, sin registro, con vídeo y propinas.',
    paragraphs: [
      'Esto es para la comunidad hispana en general — España, México, Argentina, Colombia, Chile y todo lo que hay entre medias. Da igual de dónde seas: la sala es la misma para todos.',
      'tiptalk.chat carga rápido desde cualquier país hispanohablante. Los servidores de vídeo eligen el más cercano y la voz se mantiene clara.',
      'Si organizas algo entre gente de varios países, simplemente compartes el enlace y todos llegan al mismo sitio sin instalar nada.',
    ],
  },
  {
    slug: 'chat-gratis',
    label: 'Chat gratis',
    h1: 'Chat gratis',
    metaTitle: mt('Chat gratis', 'chatPrivado'),
    metaDescription:
      'Chat gratis sin registro. Crea una sala privada con texto, voz y vídeo en menos de un minuto. Sin permanencia, sin costes ocultos.',
    paragraphs: [
      'Crear y usar una sala en tiptalk.chat es gratis. Sin tarjetas, sin pruebas que se convierten en suscripción, sin ningún coste oculto.',
      'Lo único que se paga son las propinas — y eso es opcional. Si solo quieres chatear con alguien, mandarle fotos y hablar por vídeo, no hay nada que pagar nunca.',
      'Si en algún momento quieres recibir propinas, conectas una cuenta y empiezas a cobrarlas. Hasta entonces, gratis todo.',
    ],
  },
  {
    slug: 'ganar-dinero-chat',
    label: 'Ganar dinero chat',
    h1: 'Ganar dinero con un chat',
    metaTitle: mt('Ganar dinero chat', 'ganarDinero'),
    metaDescription:
      'Cómo ganar dinero con un chat privado. Recibe propinas en tiempo real de tu audiencia. Sala gratis en tiptalk.chat.',
    paragraphs: [
      'Si lo que se te da bien es hablar — escuchar, dar consejo, animar, contar — un chat privado puede ser una vía sencilla de ganar dinero. tiptalk.chat lo monta para ti.',
      'Tú abres tu sala, le compartes el enlace a quien te sigue (Instagram, Twitter, TikTok, lo que uses) y cada persona que entra puede dejarte propinas.',
      'No tienes que cumplir horario ni quedarte conectado todo el día. Abres la sala cuando puedes, atiendes a quien entra y cobras lo que se haya juntado.',
    ],
  },
  {
    slug: 'gana-dinero-chateando',
    label: 'Gana dinero chateando',
    h1: 'Gana dinero chateando',
    metaTitle: mt('Gana dinero chateando', 'ganarDineroIng'),
    metaDescription:
      'Gana dinero chateando con tu audiencia. Propinas en directo, sin pasarelas. Crea tu sala en tiptalk.chat y empieza hoy.',
    paragraphs: [
      'Para ganar dinero chateando no necesitas montar una empresa ni gestionar pagos uno a uno. tiptalk.chat te da la sala, el sistema de propinas y la conversión a euros para que cobres.',
      'La economía es simple: tu audiencia compra Tipsys (10 Tipsys = 1€), te los mandan dentro del chat y tú los retiras cuando llegas al mínimo.',
      'Si ya tienes seguidores, lo que estás haciendo es ofrecerles un canal directo donde apoyarte sin pasar por suscripciones complicadas.',
    ],
  },
  {
    slug: 'chat-espanol-gratis',
    label: 'Chat español gratis',
    h1: 'Chat en español gratis',
    metaTitle: mt('Chat español gratis', 'salas'),
    metaDescription:
      'Chat en español, totalmente gratis. Sin registro, sin instalar, con vídeo y voz. Crea tu sala privada en tiptalk.chat.',
    paragraphs: [
      'Esto es lo que prometemos: chat en español, sin pagar nada, sin dar tu email. Pones un nick y ya estás dentro.',
      'La interfaz es directa: una caja para escribir, un botón para subir foto o vídeo, dos para empezar llamada de voz o vídeo. No te marea con menús.',
      'Si después quieres una cuenta para que tu sala te asocie a ti, te registras en un minuto. Si no, sigues como invitado todo lo que quieras.',
    ],
  },
  {
    slug: 'chat-espanol-free',
    label: 'Chat español free',
    h1: 'Chat español free',
    metaTitle: mt('Chat español free', 'chatPrivado'),
    metaDescription:
      'Free Spanish chat — sin coste, sin registro. Sala privada con voz y vídeo desde el navegador. Pensado para hispanohablantes.',
    paragraphs: [
      'Para quien busca un chat en español "free" — es decir, totalmente gratis y sin barreras — tiptalk.chat es probablemente el camino más corto.',
      'No hay periodo de prueba ni planes premium escondidos. La parte de chatear y llamar es gratis siempre.',
      'Lo único que cuesta dinero son las propinas, porque por definición son dinero. Pero eso es opcional y solo para quien quiera mandarlas.',
    ],
  },
  {
    slug: 'chat-espanol-sin-registro',
    label: 'Chat español sin registro',
    h1: 'Chat en español sin registro',
    metaTitle: mt('Chat español sin registro', 'salas'),
    metaDescription:
      'Chat en español sin registro. Crea sala, comparte enlace y chatea. No piden cuenta, no piden teléfono.',
    paragraphs: [
      'Una de las cosas que pedíais era no tener que registrarse para nada. Hecho: cualquiera puede abrir una sala con solo un nick.',
      'Lo único que se guarda es ese nick — no email, no teléfono, no nombre real. Y desaparece junto con la sala cuando se cierra.',
      'Si más tarde quieres recibir propinas, ahí sí tienes que registrar una cuenta. Pero para chatear y llamar, basta con un nombre.',
    ],
  },
];

// === COLUMNS 3 & 4: Países ==============================================
interface CountryEntry {
  slug: string;
  label: string;
  display: string; // genitive form: "para Argentina"
}

const countriesRaw: CountryEntry[] = [
  { slug: 'chat-argentina', label: 'Chat Argentina', display: 'Argentina' },
  { slug: 'chat-brasil', label: 'Chat Brasil', display: 'Brasil' },
  { slug: 'chat-bogota', label: 'Chat Bogotá', display: 'Bogotá' },
  { slug: 'chat-bolivia', label: 'Chat Bolivia', display: 'Bolivia' },
  { slug: 'chat-buenos-aires', label: 'Chat Buenos Aires', display: 'Buenos Aires' },
  { slug: 'chat-chile', label: 'Chat Chile', display: 'Chile' },
  { slug: 'chat-colombia', label: 'Chat Colombia', display: 'Colombia' },
  { slug: 'chat-costa-rica', label: 'Chat Costa Rica', display: 'Costa Rica' },
  { slug: 'chat-cuba', label: 'Chat Cuba', display: 'Cuba' },
  { slug: 'chat-ecuador', label: 'Chat Ecuador', display: 'Ecuador' },
  { slug: 'chat-el-salvador', label: 'Chat El Salvador', display: 'El Salvador' },
  { slug: 'chat-espana-pais', label: 'Chat España (país)', display: 'España' },
  { slug: 'chat-guatemala', label: 'Chat Guatemala', display: 'Guatemala' },
  { slug: 'chat-honduras', label: 'Chat Honduras', display: 'Honduras' },
  { slug: 'chat-mexico', label: 'Chat México', display: 'México' },
  { slug: 'chat-nicaragua', label: 'Chat Nicaragua', display: 'Nicaragua' },
  { slug: 'chat-republica-dominicana', label: 'Chat República Dominicana', display: 'República Dominicana' },
  { slug: 'chat-peru', label: 'Chat Perú', display: 'Perú' },
  { slug: 'chat-panama', label: 'Chat Panamá', display: 'Panamá' },
  { slug: 'chat-paraguay', label: 'Chat Paraguay', display: 'Paraguay' },
  { slug: 'chat-puerto-rico', label: 'Chat Puerto Rico', display: 'Puerto Rico' },
  { slug: 'chat-tijuana', label: 'Chat Tijuana', display: 'Tijuana' },
  { slug: 'chat-uruguay', label: 'Chat Uruguay', display: 'Uruguay' },
  { slug: 'chat-venezuela', label: 'Chat Venezuela', display: 'Venezuela' },
];

const titleSuffixes: (keyof typeof T)[] = ['ganarDinero', 'salas', 'chatPrivado', 'ganarDineroIng'];

const countries: SeoPage[] = countriesRaw.map((c, i) => ({
  slug: c.slug,
  label: c.label,
  h1: `Chat para ${c.display}`,
  metaTitle: mt(c.label, titleSuffixes[i % titleSuffixes.length]!),
  metaDescription: `Sala de chat privada para ${c.display}. Texto, voz, vídeo y propinas desde el navegador. Sin registro. Crea tu sala en tiptalk.chat.`,
  paragraphs: [
    `Si estás en ${c.display} o quieres una sala con gente de allí, tiptalk.chat funciona igual de bien. La sala se crea desde el navegador en cualquier dispositivo.`,
    `Como cada sala se comparte por enlace, vale tanto para charlar con alguien en la misma ciudad como con alguien que está al otro lado. La latencia se mantiene baja porque elegimos el servidor más cercano a quien se conecta.`,
    `Si recibes propinas, los Tipsys se acumulan en tu monedero y los retiras a tu cuenta cuando quieras. Vale para creadores, profesionales y para cualquiera que quiera cobrar por su tiempo de conversación.`,
  ],
}));

// === Exports ===========================================================
const allPages: SeoPage[] = [...features, ...spanish, ...countries];

export const seoPageMap: Record<string, SeoPage> = Object.fromEntries(
  allPages.map((p) => [p.slug, p]),
);

export const seoSlugs: string[] = allPages.map((p) => p.slug);

/** Used to render the footer 4-column link grid (in order). */
export const seoFooterColumns: SeoColumn[] = [
  { title: 'Chat', slugs: features.map((p) => p.slug) },
  { title: 'En español', slugs: spanish.map((p) => p.slug) },
  {
    title: 'Países (A-M)',
    slugs: countriesRaw.slice(0, 12).map((c) => c.slug),
  },
  {
    title: 'Países (N-V)',
    slugs: countriesRaw.slice(12).map((c) => c.slug),
  },
];
