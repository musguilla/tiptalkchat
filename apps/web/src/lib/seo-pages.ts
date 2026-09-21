/**
 * SEO landing-page catalog. Each entry powers a /c/<slug> route AND a link
 * in the homepage footer.
 *
 * Copy notes:
 *   - All Spanish, written natural — no LLM hedging or "en este artículo".
 *   - Mark the keyword we want to rank for with **double asterisks**. The
 *     page component renders those segments as <strong>.
 *   - Each page now has 6-8 paragraphs + 5 FAQs. The FAQs are surfaced as
 *     visible HTML AND emitted as FAQPage JSON-LD so Search Console can
 *     pick them up as rich results.
 *
 * Metatitle pattern (alternated per page so we don't repeat):
 *   <Keyword> - Ganar dinero chat - Tiptalk
 *   <Keyword> - Ganar dinero chateando - Tiptalk
 *   <Keyword> - Salas chat privadas - Tiptalk
 *   <Keyword> - Chat privado - Tiptalk
 */

export interface SeoFaq {
  q: string;
  a: string;
}

export interface SeoPage {
  slug: string;
  /** Short label used in the footer link */
  label: string;
  /** H1 shown at the top of the page */
  h1: string;
  /** Lead paragraph immediately under the H1 — keep it punchy. */
  intro: string;
  /** Body paragraphs (use **kw** to bold) */
  paragraphs: string[];
  /** FAQs rendered as accordion + JSON-LD schema */
  faqs: SeoFaq[];
  /** <title> */
  metaTitle: string;
  /** <meta name="description"> */
  metaDescription: string;
}

export interface SeoColumn {
  title: string;
  /** i18n key for the localized column heading (t(col.titleKey)). */
  titleKey: string;
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

// ===== Reusable FAQ snippets ============================================
const FAQ_REGISTRO: SeoFaq = {
  q: '¿Necesito registrarme para usar tiptalk.chat?',
  a: 'No. Puedes crear una sala solo con un nick y un nombre, y la otra persona entra desde el enlace sin abrir cuenta. El registro solo hace falta si quieres recibir propinas y retirarlas a tu cuenta.',
};

const FAQ_PRIVACIDAD: SeoFaq = {
  q: '¿Qué pasa con mis mensajes cuando se cierra la sala?',
  a: 'Cuando cierras la sala (o pasan 24 horas), borramos todos los mensajes, fotos y vídeos que se hayan subido. No queda nada guardado en nuestros servidores más allá del registro de transacciones de propinas, que es obligatorio por fiscalidad.',
};

const FAQ_PRECIO: SeoFaq = {
  q: '¿Cuánto cuesta crear una sala?',
  a: 'Crear una sala es gratis y siempre lo será. Lo único que se paga son las propinas, porque son dinero real que se transfiere de una persona a otra. Si solo quieres chatear y llamar, no pagas nada.',
};

const FAQ_MOVIL: SeoFaq = {
  q: '¿Funciona desde el móvil?',
  a: 'Sí, sin necesidad de instalar una app. La sala se abre en el navegador del móvil (Chrome, Safari, Firefox) igual que cualquier web. Las llamadas usan el micro y la cámara del teléfono.',
};

const FAQ_PROPINAS: SeoFaq = {
  q: '¿Cómo funcionan las propinas?',
  a: 'Las propinas se llaman Tipsys. 1€ son 8 Tipsys cuando se compran. Cuando alguien te manda Tipsys, se acumulan en tu monedero y los conviertes a euros cuando quieras retirarlos (10 Tipsys = 1€ en la conversión a euro).',
};

const FAQ_NAVEGADOR: SeoFaq = {
  q: '¿En qué navegadores funciona?',
  a: 'Funciona en Chrome, Safari, Firefox, Edge y Brave actualizados. Para las videollamadas el navegador pedirá permiso para usar la cámara y el micro la primera vez.',
};

// === COLUMN 1: Features de chat =========================================
const features: SeoPage[] = [
  {
    slug: 'chat-online',
    label: 'Chat online',
    h1: 'Chat online en directo',
    metaTitle: mt('Chat online', 'salas'),
    metaDescription:
      'Chat online en directo en español. Crea una sala privada y empieza a hablar con quien quieras en segundos. Sin instalar nada.',
    intro:
      'Un **chat online** sencillo, privado y sin descargas. Tú abres la sala, compartes el enlace y empieza la conversación.',
    paragraphs: [
      'En tiptalk.chat puedes abrir un **chat online** en segundos. No hay descargas, no hay número de teléfono, no hay esperas. Solo escribes el nombre de la sala, le das al botón de crear y ya tienes el enlace listo para compartir con quien quieras.',
      'Funciona desde el navegador del móvil o del ordenador, lo mismo da. La conversación es solo entre tú y la persona del otro lado, no hay grupos masivos ni gente entrando por sorpresa. Lo que ocurre dentro de tu **chat online** queda entre vosotros.',
      'Si te apetece pasar del texto, lanzas una llamada de voz o una videollamada con un botón. La calidad de la llamada se adapta a tu conexión: si vas justo de cobertura, se queda la voz y se baja la resolución para no cortarse.',
      'Y si te están contando algo que merece la pena, puedes dejarles propinas en directo. La animación aparece en pantalla al instante para que la otra persona vea el detalle sin que tengas que decir nada.',
      'A diferencia de un grupo de WhatsApp o un servidor de Discord, lo que mandas no se guarda para siempre. Al cerrar la sala (o pasadas 24 horas) se borra todo: mensajes, fotos y vídeos. La idea es que el **chat online** sea como una conversación de voz: vivo mientras pasa y nada más.',
      'Está pensado para gente que necesita un sitio rápido para hablar con alguien sin pasar por las redes sociales. Una clase particular, una consulta puntual, un rato de charla con quien conociste fuera o una llamada con la familia que vive lejos.',
      'No hay límite de cuántas salas puedes crear. Si una se llena de contexto y quieres empezar de cero, abres otra en treinta segundos y compartes el nuevo enlace.',
    ],
    faqs: [
      {
        q: '¿Puedo usar tiptalk.chat como chat online para mi negocio?',
        a: 'Sí. Mucha gente lo usa para consultas con clientes, clases particulares o sesiones de coaching. La sala es privada, el cobro va por propinas o por una tarifa fija que tú comunicas antes, y al terminar no queda historial.',
      },
      {
        q: '¿Cuántas personas pueden entrar en un chat online?',
        a: 'Por diseño es uno a uno. La sala admite a la persona que la creó y a quien tenga el enlace, lo que da una conversación privada de dos. Si necesitas más, puedes abrir varias salas a la vez.',
      },
      FAQ_REGISTRO,
      FAQ_PRIVACIDAD,
      FAQ_MOVIL,
    ],
  },
  {
    slug: 'chat-propinas',
    label: 'Chat propinas',
    h1: 'Chat con propinas',
    metaTitle: mt('Chat propinas', 'ganarDinero'),
    metaDescription:
      'Chat privado con propinas integradas. Recibe tips de tu audiencia en cada conversación. Crea tu sala gratis y empieza ya.',
    intro:
      'En tiptalk.chat las **propinas** están dentro del chat. Un botón, una cantidad, y aparece en pantalla al instante.',
    paragraphs: [
      'La gracia de tiptalk.chat es que cualquier conversación puede convertirse en un **chat propinas**. Si te están haciendo reír, si te están ayudando, si simplemente quieres reconocer el tiempo de la otra persona, hay un botón. Sin cambiar de app, sin abrir Bizum, sin pasar a otra pestaña.',
      'Funciona con Tipsys, nuestra moneda virtual. 1€ son 8 Tipsys cuando se compran y 10 Tipsys son 1€ cuando se convierten al cobrar. Quien recibe **propinas** las acumula en su monedero y puede convertirlas en euros cuando llegue al mínimo de retirada.',
      'Es directo, sin pasarelas torpes ni saltos a otra app. Le das a un botón, eliges la cantidad y aparece una animación en el chat para que la otra persona lo vea de inmediato. No hay confirmaciones a posteriori ni emails de "te ha llegado un Bizum".',
      'Hay propinas predefinidas (0,25 €, 0,50 €, 1 €, 2 €, 5 €) y la opción de poner una cantidad libre. Si quieres incluir una nota corta junto con la propina, se manda al lado: un gracias, una broma, lo que sea.',
      'Cuando recibes muchas **propinas** en una misma conversación, todas aparecen en el monedero como movimientos separados. Eso te da un historial claro: puedes ver cuándo llegó cada una y de qué sala viene.',
      'Para empezar a recibir, solo tienes que registrarte (en menos de un minuto), conectar una cuenta de cobros y abrir una sala. Lo que viene después es chatear: el resto lo gestiona la plataforma.',
      'El sistema funciona igual de bien para creadores con audiencia grande que para profesionales que dan una consulta puntual. Si tu trabajo se mide en conversaciones, tener las **propinas** dentro del chat baja la fricción al mínimo.',
    ],
    faqs: [
      {
        q: '¿Quién paga las comisiones del chat de propinas?',
        a: 'La comisión la asume quien recibe la propina (30%). Quien da la propina paga el precio que ve en pantalla sin recargos adicionales — lo que ofrezca son los euros que se entregan.',
      },
      {
        q: '¿Cuál es el mínimo para retirar propinas a mi cuenta?',
        a: 'El mínimo de retirada es 300 Tipsys, equivalente a 30 € brutos antes de comisión. Se puede solicitar el cobro cuantas veces quieras una vez superado ese umbral.',
      },
      FAQ_PROPINAS,
      FAQ_REGISTRO,
      FAQ_PRIVACIDAD,
    ],
  },
  {
    slug: 'chat-movil',
    label: 'Chat móvil',
    h1: 'Chat para el móvil',
    metaTitle: mt('Chat móvil', 'chatPrivado'),
    metaDescription:
      'Chat privado optimizado para móvil. Texto, voz y vídeo desde el navegador. Sin descargas. Comparte el enlace y chatea ya.',
    intro:
      'tiptalk.chat funciona como un **chat móvil** sin apps: la sala se abre en Safari o Chrome y ya estás dentro.',
    paragraphs: [
      'tiptalk.chat está pensado para el móvil. La sala se abre desde Safari, Chrome o el navegador que uses, igual que cuando abres cualquier web. No hay app que descargar, no hay actualizaciones, no hay permisos raros: solo una pestaña más.',
      'Puedes mandar mensajes, fotos, vídeos cortos y empezar llamadas con la cámara delantera o el micro. Todo desde el mismo sitio. Si decides hacer una videollamada, el navegador pide permiso para usar la cámara la primera vez y luego se queda concedido para esa sala.',
      'No hay app que instalar ni notificaciones extrañas. Si cierras la pestaña, la conversación sigue ahí mientras la sala esté abierta. Vuelves a entrar desde el enlace y retomas donde lo dejaste.',
      'La interfaz del **chat móvil** se adapta a la pantalla: los mensajes ocupan el ancho útil, el teclado se ajusta solo y los botones de llamada quedan a mano del pulgar arriba a la derecha.',
      'Cuando estás en una videollamada, el chat sigue activo debajo. Puedes ver mensajes que entran sin tener que colgar, y la persona del otro lado ve lo que escribes mientras hablas. Útil para pasar un enlace, una dirección o una cifra sin perder hilo.',
      'Las llamadas en **chat móvil** funcionan con datos o WiFi, y se adaptan a la calidad de la red. Si tienes 4G débil, baja la resolución del vídeo automáticamente para que la voz no se corte. Y si pierdes la conexión, al volver retoma sola.',
      'Sirve igual desde un iPhone como desde un Android. La única condición es tener el navegador actualizado: nada raro, todos los teléfonos de los últimos años cumplen.',
    ],
    faqs: [
      {
        q: '¿Necesito instalar una app para usar el chat en el móvil?',
        a: 'No. Toda la experiencia funciona desde el navegador. No hay versión nativa porque no hace falta: las videollamadas, las propinas y las fotos van bien desde la web.',
      },
      {
        q: '¿Gasta muchos datos un chat móvil con vídeo?',
        a: 'Una videollamada estándar consume entre 5 y 10 MB por minuto. Si vas justo de datos, puedes apagar la cámara y dejar solo la voz, que baja a menos de 1 MB por minuto.',
      },
      FAQ_NAVEGADOR,
      FAQ_REGISTRO,
      FAQ_PRIVACIDAD,
    ],
  },
  {
    slug: 'chatroulette',
    label: 'ChatRoulette',
    h1: 'Alternativa a ChatRoulette',
    metaTitle: mt('ChatRoulette', 'chatPrivado'),
    metaDescription:
      'Sala de chat privada uno a uno. Tú eliges con quién hablas — sin sorpresas. Alternativa moderna a ChatRoulette en español.',
    intro:
      'Si llegas buscando **ChatRoulette**, tiptalk.chat es la versión controlada: tú decides quién entra, sin desconocidos al azar.',
    paragraphs: [
      'Si llegas buscando algo tipo **ChatRoulette**, lo que tiptalk.chat hace es parecido pero distinto: tú decides con quién hablas. Tú abres la sala y compartes el enlace con la persona o personas que quieres meter dentro.',
      'No hay ruleta ni desconocidos al azar. Es una sala privada uno a uno, controlada por ti. Si te incomoda alguien, cierras y abres otra. La diferencia clave con un **ChatRoulette** clásico es que aquí tú escoges, no la suerte.',
      'Esto evita los problemas típicos de las ruletas de chat: gente que se conecta sin cámara, contenido no deseado, conversaciones que duran tres segundos. Aquí la sala es tuya y entra solo quien tú decides.',
      'Si tu intención es conocer gente nueva, simplemente compartes el enlace en un foro, en una red social o donde te apetezca. Quien te interese te encontrará. Tú mantienes el control sobre quién entra y cuándo.',
      'Funciona en cualquier dispositivo con navegador y tienes vídeo, voz, texto y propinas en el mismo sitio. Es como un **ChatRoulette** pero pensado para 2026: sin descargas, sin Flash, sin apuntarse a nada.',
      'Para creadores que vienen de plataformas de cámara, tiptalk.chat ofrece algo que esas no tenían: propinas en directo dentro del chat. Tú decides cuándo abres y cierras, sin contratos ni cuota fija.',
      'Si tu sala tiene tráfico, los Tipsys que recibes los conviertes a euros cuando quieras. La gestión es mucho más limpia que cualquier ruleta clásica, donde el modelo de monetización era confuso o directamente inexistente.',
    ],
    faqs: [
      {
        q: '¿Tiptalk.chat es como ChatRoulette?',
        a: 'Comparte la idea del chat uno a uno con vídeo, pero no la ruleta. Aquí tú compartes el enlace de tu sala con quien quieres, en lugar de que el sistema te empareje con un desconocido al azar.',
      },
      {
        q: '¿Puedo abrir una sala pública como un ChatRoulette?',
        a: 'Puedes compartir el enlace donde quieras (foros, redes, un perfil) y cualquiera con ese enlace entrará a tu sala. Tú sigues controlando el acceso porque puedes cerrarla en cualquier momento o ponerle un PIN.',
      },
      FAQ_REGISTRO,
      FAQ_PRIVACIDAD,
      FAQ_MOVIL,
    ],
  },
  {
    slug: 'chat-amigos',
    label: 'Chat amigos',
    h1: 'Chat para hablar con amigos',
    metaTitle: mt('Chat amigos', 'salas'),
    metaDescription:
      'Chat privado para hablar con amigos. Texto, voz y vídeo desde el navegador. Sin grupos enormes ni notificaciones, solo tú y quien tú quieras.',
    intro:
      'Un **chat con amigos** sin meter más ruido en WhatsApp. Sala privada, voz, vídeo y nada que quede grabado.',
    paragraphs: [
      'A veces no quieres meter una conversación en WhatsApp, ni que quede ahí para siempre. tiptalk.chat te da una sala privada que existe solo mientras la quieras tener abierta. Pensado para un **chat amigos** puntual sin contaminar el resto de chats.',
      'Puedes meter a un amigo, compartir fotos y vídeos, llamar por voz o hacer videollamada. Cuando termináis, cierras la sala y se borra todo lo que se ha mandado dentro. No hay historial que se quede colgado de tu teléfono ni del suyo.',
      'Sirve para cuadrar planes, para una llamada larga con alguien de fuera o simplemente para tener un sitio sin ruido donde charlar. Como no hay grupos masivos, no entran avisos cada dos minutos que te saquen del tema.',
      'Si quedas con una amiga que vive en otro país y la diferencia horaria os deja una ventana corta para hablar, abrir un **chat amigos** en tiptalk.chat resuelve: ella entra desde un enlace, tú desde otro, y os ponéis a hablar sin descargar nada.',
      'Para llamadas largas el sistema mantiene la conexión incluso si uno de los dos cambia de WiFi a 4G a mitad de conversación. La calidad se baja un momento y se recupera, sin tener que recolgar.',
      'Como no hace falta cuenta, puedes invitar a alguien que pase de instalar otra app. Solo necesita el enlace. Pone su nombre, entra y ya está dentro.',
      'Es especialmente útil cuando hay un tercer canal (una pareja, un primo, un trabajo) donde ya hay mucho ruido. Abrir un **chat amigos** aparte permite no mezclar conversaciones.',
    ],
    faqs: [
      {
        q: '¿Mis amigos tienen que crearse una cuenta para entrar al chat?',
        a: 'No. Solo necesitan el enlace que les compartas. Al entrar les pide un nick para identificarse en la sala y ya está.',
      },
      {
        q: '¿Puedo crear varias salas a la vez para grupos distintos de amigos?',
        a: 'Sí. Cada sala es independiente y vive solo mientras la mantengas abierta. Puedes tener una con amigos del cole, otra con compañeros del gimnasio y otra con la familia, sin que se mezclen.',
      },
      FAQ_REGISTRO,
      FAQ_PRIVACIDAD,
      FAQ_MOVIL,
    ],
  },
  {
    slug: 'chat-privado',
    label: 'Chat privado',
    h1: 'Chat privado para uno a uno',
    metaTitle: mt('Chat privado', 'chatPrivado'),
    metaDescription:
      'Chat privado uno a uno con vídeo, voz y propinas. Tú abres la sala, compartes el enlace y solo entra quien tú decidas.',
    intro:
      'Un **chat privado** de verdad: sala uno a uno, sin historial guardado, con vídeo y propinas en el mismo sitio.',
    paragraphs: [
      'tiptalk.chat es básicamente un **chat privado** de los de toda la vida, pero mejor montado. Tú eres quien decide quién entra: si no tienes el enlace, no llegas a la sala. Y aunque tengas el enlace, si el creador la cierra, deja de funcionar.',
      'Por defecto, nada de lo que pasa dentro queda guardado al cerrar. Borramos los mensajes y los archivos al terminar la conversación, y a las 24 horas la sala se cierra sola. Es la diferencia con cualquier red social: aquí lo que mandas no entrena nada ni queda en un servidor para siempre.',
      'Si quieres más privacidad todavía, puedes ponerle un **PIN** a la sala para que el enlace por sí solo no baste. Así, aunque alguien copie y comparta el link, no podrá entrar sin el código.',
      'El **chat privado** soporta texto, fotos, vídeos cortos, llamadas de voz y videollamadas. Todo en la misma sala. Si pasas de chat a vídeo y luego vuelves, no se cae nada: sigue siendo el mismo hilo.',
      'A diferencia de los chats integrados en redes sociales, aquí no hay anuncios, no hay recomendaciones, no hay "personas que quizás conozcas". Es solo el chat. La empresa no monetiza tus conversaciones — monetiza las propinas, y solo si tú decides usarlas.',
      'En cuanto a privacidad técnica: las conexiones van por TLS, los archivos pasan por almacenamiento cifrado y los webhooks de pagos cumplen con los estándares de Stripe Connect. No es magia ni promesas vagas: es la pila estándar bien configurada.',
      'Cuando cierras una sala, se ejecuta un proceso que limpia todo lo asociado: media en almacenamiento, mensajes en base de datos y la propia sala. La única cosa que sobrevive es el ledger de propinas, que es un registro contable obligatorio.',
    ],
    faqs: [
      {
        q: '¿Tiptalk.chat es realmente un chat privado?',
        a: 'Sí. La sala solo es accesible para quien tenga el enlace (y el PIN si lo activaste). El contenido se borra al cerrar. No mostramos las salas en ningún listado público.',
      },
      {
        q: '¿Está cifrado de extremo a extremo el chat privado?',
        a: 'Las conexiones usan TLS de extremo a extremo navegador → servidor, pero los mensajes pasan por nuestro backend para poder repartirse a los destinatarios. No es E2EE puro como Signal, pero el contenido se borra al cerrar la sala.',
      },
      FAQ_REGISTRO,
      FAQ_PRIVACIDAD,
      FAQ_NAVEGADOR,
    ],
  },
  {
    slug: 'chat-token',
    label: 'Chat token',
    h1: 'Chat con tokens — Tipsys',
    metaTitle: mt('Chat token', 'ganarDineroIng'),
    metaDescription:
      'Sala de chat con sistema de tokens (Tipsys). Recibe propinas en directo de tu audiencia. Convierte tus tokens en euros cuando quieras.',
    intro:
      'tiptalk.chat funciona como un **chat token**: dentro hay Tipsys, fuera euros. Compras, mandas, retiras.',
    paragraphs: [
      'Los **tokens** de tiptalk.chat se llaman Tipsys. La conversión es sencilla: 1€ equivale a 8 Tipsys cuando se compran. Al cobrar, 10 Tipsys equivalen a 1€ (la diferencia es la comisión que mantiene la plataforma).',
      'Cuando alguien te manda Tipsys, se acumulan en tu monedero. Cuando llegas al mínimo (300 Tipsys = 30 € brutos), los conviertes en euros y los retiras a tu cuenta bancaria. El cobro pasa por nuestro proveedor de pagos y normalmente llega en 1-2 días laborables.',
      'Lo que ves dentro del **chat token** es directo: cada propina aparece como una mini-animación al instante. Sin esperas, sin liquidaciones de fin de mes, sin facturas atascadas en una bandeja de entrada.',
      'Los **tokens** son ideales para creadores porque desacoplan la decisión de "voy a apoyar a esta persona" de la decisión de "voy a meter mi tarjeta otra vez". Tu audiencia compra un pack y luego va dejando propinas con un clic, sin volver a pasar por la pasarela.',
      'Hay packs de 40 (5 €), 80 (10 €), 160 (20 €) y 400 (50 €) Tipsys. Cuanto más grande el pack, más fácil que tu audiencia mantenga el hábito sin tener que recargar cada vez. Si alguien quiere otra cantidad, lo decides tú: la sala admite cantidades libres.',
      'Como el **chat token** es propio de la plataforma, no hay riesgo de que un cobro falle por un problema con una pasarela externa. Si tienes Tipsys en tu monedero, son tuyos.',
      'En cuanto a fiscalidad: las retiradas se hacen a tu cuenta y son ingresos personales sujetos a IRPF en España (o equivalente en tu país). Te entregamos un resumen mensual en tu panel para que sea fácil declararlos.',
    ],
    faqs: [
      {
        q: '¿Qué son los Tipsys, el token interno de tiptalk.chat?',
        a: 'Es nuestra moneda virtual de propinas. 1€ equivale a 8 Tipsys cuando se compran, 10 Tipsys equivalen a 1€ cuando se cobran. La diferencia es la comisión de plataforma (30%).',
      },
      {
        q: '¿Caducan los Tipsys en el monedero?',
        a: 'No, los Tipsys que tienes en tu monedero se mantienen indefinidamente. Puedes mandarlos como propinas o retirarlos en euros cuando llegues al mínimo.',
      },
      FAQ_PROPINAS,
      FAQ_PRECIO,
      FAQ_REGISTRO,
    ],
  },
  {
    slug: 'chat-tips',
    label: 'Chat tips',
    h1: 'Chat con tips en directo',
    metaTitle: mt('Chat tips', 'ganarDinero'),
    metaDescription:
      'Recibe tips directamente en el chat. Voz, vídeo y propinas en la misma sala. Sin pasarelas externas, sin esperas.',
    intro:
      'Los **tips** en tiptalk.chat van dentro del chat. Botón, cantidad, animación y listo.',
    paragraphs: [
      'Un **tip** en tiptalk.chat es algo que la persona que está al otro lado puede mandarte sin salir del chat. Le da a un botón, elige cuánto, y aparece la animación al instante. Tú lo ves en directo y la otra persona se va con la sensación de haberte agradecido el rato.',
      'Es mucho más directo que un Bizum aparte o un PayPal abierto en otra pestaña. El **chat tips** integra la propina como un mensaje más, con su animación visual y su entrada en el monedero.',
      'Sirve igual para creadores que para profesionales que cobran una consulta corta o para amigos que quieren invitarte a algo a distancia. La economía es la misma: Tipsys que se acumulan y se convierten en euros.',
      'Para el creador, recibir **tips** dentro del chat tiene una ventaja sobre el modelo de "Paga al final": la propina se da en caliente, justo después del momento que te hace dar las gracias. Eso es psicológicamente más fácil que abrir otra app para mandar 2 € fríos.',
      'La animación de la propina es discreta — no interrumpe ni tapa el chat. Solo aparece durante un par de segundos como una emoji volando, y queda registrada en el historial como un mensaje del sistema.',
      'Para casos donde quieres dar las gracias por algo específico — una respuesta útil, una broma — puedes dejar una **tip** sobre el mensaje concreto. Así sabes a qué se refería la propina cuando luego mires tu historial.',
      'No hay un mínimo bajo: el **tip** más pequeño son 25 céntimos (2 Tipsys). El más alto es libre — la persona elige la cantidad. Si tu sala se mueve bien, los tickets medios suelen estar entre 50 céntimos y 2 €.',
    ],
    faqs: [
      {
        q: '¿Tengo que pagar para mandar un tip en un chat?',
        a: 'Para mandar tips primero compras Tipsys (1€ = 8 Tipsys) y los vas mandando con un clic durante la conversación. No hay coste adicional por tip individual; el coste es comprar Tipsys.',
      },
      {
        q: '¿Puedo mandar tips a varias personas a la vez?',
        a: 'Tu monedero es uno y los Tipsys que tengas sirven para cualquier sala. Si abres varias salas, puedes ir mandando propinas en cada una usando el mismo saldo.',
      },
      FAQ_PROPINAS,
      FAQ_PRECIO,
      FAQ_PRIVACIDAD,
    ],
  },
  {
    slug: 'chatear-online',
    label: 'Chatear online',
    h1: 'Chatear online en español',
    metaTitle: mt('Chatear online', 'salas'),
    metaDescription:
      'Chatear online en español. Sala privada con texto, voz y vídeo desde el navegador. Comparte el enlace y empieza ya.',
    intro:
      'Para **chatear online** en español sin descargar nada: abres sala, compartes enlace, habláis.',
    paragraphs: [
      '**Chatear online** en tiptalk.chat es abrir una sala con un nombre, compartir el enlace y listo. No piden cuenta, no piden teléfono, no piden verificación por SMS. Vas directo al chat.',
      'La sala es solo tuya y de quien decidas invitar. Si quieres pasar del texto a vídeo o voz, ya está dentro del mismo sitio: dos botones arriba a la izquierda. No tienes que abrir Skype, ni Google Meet, ni Zoom.',
      'A las 24 horas se cierra sola y todo lo que mandasteis dentro desaparece. Si quieres más tiempo, simplemente abres otra. Esto va bien para conversaciones que no quieres que se acumulen en tu historial general.',
      'Para **chatear online** con alguien que está al otro lado del mundo, lo único que necesitas es buena conexión a internet. La latencia se mantiene baja porque elegimos servidores de llamada según donde estéis los dos.',
      'A diferencia de otras webs de **chatear online**, aquí las propinas son una parte natural del flujo. Si te ha gustado el rato con alguien, lo dices con un botón. Si te están ayudando, lo reconoces sin abrir otra app.',
      'La interfaz está en español, los mensajes del sistema están en español, los emojis y stickers se manejan en español. No hay traducciones torpes ni botones medio en inglés. Está pensado para hispanohablantes.',
      'Si solo vas a entrar a chatear una vez puntual, no hace falta ni que dejes tu nombre real. Pones un nick cualquiera y ya estás dentro.',
    ],
    faqs: [
      {
        q: '¿Cuántas personas pueden chatear online a la vez en una sala?',
        a: 'La sala está pensada para uno a uno (dos personas). Si necesitas chatear online con más gente, lo recomendable es abrir varias salas o usar otro tipo de herramienta.',
      },
      {
        q: '¿Funciona para chatear online entre países distintos?',
        a: 'Sí. Las llamadas se enrutan por servidores en Europa, EE.UU. y Sudamérica, así que la latencia se mantiene baja sea cual sea el destino. Mensajes y propinas viajan al instante.',
      },
      FAQ_REGISTRO,
      FAQ_MOVIL,
      FAQ_NAVEGADOR,
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
    intro:
      '**Chat en español** para hispanohablantes — la interfaz, los mensajes y los emojis. Todo pensado para ti.',
    paragraphs: [
      'tiptalk.chat funciona íntegramente en español. La interfaz, los avisos, el formulario para crear sala. Todo está pensado para quien habla castellano sin importar el país. No es una traducción a medias: está escrito en español de origen.',
      'Como la sala se comparte por enlace, no importa si la otra persona está en otra zona horaria. Se conectan los dos, hablan y cierran. La diferencia con otros chats es que aquí no hay que pelear con menús traducidos por una IA o instrucciones que se quedan en inglés.',
      'Sirve igual para charlar con familia, para una clase particular en remoto, para hablar con alguien que conociste en otra red, o para dar consultas con propinas. El **chat en español** se adapta a cualquier uso porque las herramientas son las mismas: texto, voz, vídeo, propinas.',
      'Para creadores hispanohablantes, abrir un **chat en español** propio resuelve un problema común: muchas plataformas grandes son americanas y el sistema de pagos no acepta cuentas españolas o latinoamericanas fácilmente. Aquí los cobros se hacen a cuentas europeas y americanas sin trampas.',
      'La moneda virtual (Tipsys) se muestra en euros porque es lo natural en España. Si vives en Latinoamérica, puedes convertir mentalmente: 1€ son 8 Tipsys aproximadamente. Las retiradas pueden hacerse a cuentas de varios países.',
      'Los mensajes del sistema dentro de la sala también están en español: "Carlos ha entrado en la sala", "Sala cerrada por el anfitrión", "Te han enviado una propina de 2 €". Pequeños detalles que hacen que la experiencia sea coherente.',
      'No hay restricciones por país para abrir una sala. Puedes estar en Madrid, en Buenos Aires, en CDMX o en Caracas. El servicio funciona igual y los servidores se eligen para minimizar la latencia desde donde estés.',
    ],
    faqs: [
      {
        q: '¿El chat en español funciona desde Latinoamérica?',
        a: 'Sí, sin restricciones. Los servidores de llamada están repartidos entre Europa, EE.UU. y Sudamérica, así que la calidad se mantiene buena sin importar el país.',
      },
      {
        q: '¿Puedo recibir propinas en mi chat en español si vivo en México o Argentina?',
        a: 'Sí, mientras tengas una cuenta bancaria que acepte transferencias internacionales. La retirada pasa por Stripe Connect, que opera en la mayoría de países hispanohablantes.',
      },
      FAQ_REGISTRO,
      FAQ_PRECIO,
      FAQ_PRIVACIDAD,
    ],
  },
  {
    slug: 'chat-espana',
    label: 'Chat España',
    h1: 'Chat para España',
    metaTitle: mt('Chat España', 'chatPrivado'),
    metaDescription:
      'Chat privado en español para España. Vídeo y voz HD desde el navegador. Crea tu sala gratis y comparte el enlace.',
    intro:
      'Un **chat España** sencillo: sin descargas, en castellano, con servidores en Europa para que vaya rápido.',
    paragraphs: [
      'Si estás en España y quieres una sala de **chat España** sin descargar ninguna app, tiptalk.chat te la abre en segundos. Funciona en cualquier móvil, en cualquier ordenador, con cualquier navegador moderno.',
      'No hace falta darse de alta ni dejar el número. Pones un nick, pones el nombre de la sala y ya tienes el enlace para compartir. La gente que entre desde el enlace también puede llegar como invitada — sin obligarles a registrarse.',
      'Las llamadas viajan por servidores en Europa, así que la latencia es baja entre España y la mayor parte del continente. Una llamada Madrid-Barcelona se mueve por ahí cerca, no por California como pasa con otros servicios.',
      'Para creadores en **chat España**, la plataforma admite cuentas bancarias españolas y europeas sin extras. La retirada de propinas llega como transferencia normal a tu cuenta del banco que uses.',
      'Los Tipsys (la moneda virtual) están denominados en euros, que es la moneda que tiene sentido para usuarios españoles. No hay conversiones raras: si recibes 50 € en Tipsys, retiras 50 € (menos comisión).',
      'A nivel de cumplimiento normativo, tiptalk.chat opera bajo la legislación de la UE — RGPD para datos personales, IVA donde aplique, normativa de servicios digitales. No es un servicio sombrío al margen: es un negocio español con su papeleo en regla.',
      'Para uso particular en **chat España** — una llamada con un amigo, una clase, una conversación con alguien que conociste en otra red — funciona sin más. No hace falta cuenta, no hace falta nada.',
    ],
    faqs: [
      {
        q: '¿Puedo recibir propinas en mi cuenta bancaria española?',
        a: 'Sí. Las retiradas pasan por Stripe Connect, que admite cuentas españolas (IBAN) sin problema. El ingreso llega como transferencia SEPA en 1-2 días laborables.',
      },
      {
        q: '¿Hay que pagar IVA por las propinas recibidas?',
        a: 'Las propinas son ingresos personales y, como tales, tributan en el IRPF. El IVA depende de si estás dado de alta como autónomo o no. Para uso ocasional sin facturar, no hay IVA implicado.',
      },
      FAQ_REGISTRO,
      FAQ_PRECIO,
      FAQ_PRIVACIDAD,
    ],
  },
  {
    slug: 'chat-hablahispana',
    label: 'Chat habla hispana',
    h1: 'Chat para la comunidad hispana',
    metaTitle: mt('Chat habla hispana', 'salas'),
    metaDescription:
      'Sala de chat para la comunidad hispanohablante. España y Latinoamérica en el mismo sitio, sin registro, con vídeo y propinas.',
    intro:
      '**Chat habla hispana** sin barreras: España, México, Argentina, Colombia, Chile, todo en la misma sala.',
    paragraphs: [
      'Esto es para la comunidad de **habla hispana** en general — España, México, Argentina, Colombia, Chile y todo lo que hay entre medias. Da igual de dónde seas: la sala es la misma para todos.',
      'tiptalk.chat carga rápido desde cualquier país hispanohablante. Los servidores de vídeo eligen el más cercano y la voz se mantiene clara. Una conversación México-España va por servidores transatlánticos optimizados, no por un solo punto en el medio que añade latencia.',
      'Si organizas algo entre gente de varios países, simplemente compartes el enlace y todos llegan al mismo sitio sin instalar nada. Es la ventaja de ser web: no importa qué teléfono use cada uno.',
      'El **chat habla hispana** es especialmente útil para creadores con audiencia distribuida. Si tienes seguidores en varios países hispanohablantes, abrir una sala les da un punto de encuentro común sin tener que pelearse con plataformas que solo funcionan en uno.',
      'Las propinas en euros son fáciles de entender desde España, pero los usuarios de Latinoamérica las ven y las convierten mentalmente a su moneda local. La conversión a peso/dólar/bolívar/sol depende del banco emisor cuando se hace el pago.',
      'A nivel de tono, la plataforma usa un español neutro: "tú" como pronombre, formas verbales que se entienden tanto en España como en Latinoamérica, sin modismos demasiado regionales. La idea es que sea cómodo para cualquier hispanohablante.',
      'Para una conversación entre dos personas de diferentes países, el **chat habla hispana** funciona igual que cualquier otra sala: texto, voz, vídeo y propinas. La distancia geográfica no afecta a lo que puedes hacer dentro.',
    ],
    faqs: [
      {
        q: '¿Puedo abrir un chat de habla hispana con gente de diferentes países?',
        a: 'Sí. La sala admite a quien tenga el enlace, sin importar desde dónde se conecte. Las llamadas se enrutan para minimizar la latencia incluso si los participantes están en continentes distintos.',
      },
      {
        q: '¿La moneda de propinas funciona en Latinoamérica?',
        a: 'Las propinas se gestionan en Tipsys, equivalentes a euros (1€ = 8 Tipsys). Quien compra Tipsys desde Latinoamérica paga el equivalente en su moneda local según el cambio del momento.',
      },
      FAQ_REGISTRO,
      FAQ_PRIVACIDAD,
      FAQ_NAVEGADOR,
    ],
  },
  {
    slug: 'chat-gratis',
    label: 'Chat gratis',
    h1: 'Chat gratis',
    metaTitle: mt('Chat gratis', 'chatPrivado'),
    metaDescription:
      'Chat gratis sin registro. Crea una sala privada con texto, voz y vídeo en menos de un minuto. Sin permanencia, sin costes ocultos.',
    intro:
      '**Chat gratis** de verdad: sin tarjetas, sin tiempos de prueba, sin sorpresas en la factura.',
    paragraphs: [
      'Crear y usar una sala en tiptalk.chat es **gratis**. Sin tarjetas, sin pruebas que se convierten en suscripción, sin ningún coste oculto. Esto es lo más importante: la herramienta básica no cuesta dinero ahora ni va a costarlo después.',
      'Lo único que se paga son las propinas — y eso es opcional. Si solo quieres chatear con alguien, mandarle fotos y hablar por vídeo, no hay nada que pagar nunca. Ni a la semana ni al mes ni al año.',
      'Si en algún momento quieres recibir propinas, conectas una cuenta y empiezas a cobrarlas. Hasta entonces, **chat gratis** todo. Y aunque empieces a recibir propinas, la sala sigue siendo gratis: el coste es solo la comisión sobre lo que cobras.',
      'A diferencia de muchas webs de chat gratis con asteriscos por todas partes, aquí no hay límites de minutos, ni "gratis hasta 5 mensajes", ni "primer mes gratis y luego 9,99". Es gratis en el sentido honesto de la palabra.',
      'Para creadores que están empezando, esto es importante: puedes probar el modelo sin riesgo. Abres tu sala, le pones tu enlace en bio, y ves si funciona. Si no, no has perdido nada. Si funciona, empiezas a cobrar comisión solo cuando hay propinas.',
      'No mostramos anuncios dentro del chat ni vendemos datos. El modelo de negocio es la comisión sobre las propinas. Eso significa que si nadie cobra, nosotros tampoco — los incentivos están alineados.',
      'El **chat gratis** vale para todo: una sesión entre amigos, una clase particular, una conversación con un cliente, una llamada con familia que vive lejos. La herramienta es la misma; lo que cambia es el uso que le des.',
    ],
    faqs: [
      {
        q: '¿Hasta cuándo es gratis el chat?',
        a: 'Es gratis siempre. No hay periodo de prueba ni plan premium escondido. El uso básico (chatear, llamar, vídeo) es gratis indefinidamente.',
      },
      {
        q: '¿Hay algún coste oculto si abro mi sala?',
        a: 'No. Crear y mantener salas no tiene coste. Solo hay comisión (30%) sobre las propinas que recibas, y se aplica al cobrar, no por abrir la sala.',
      },
      FAQ_PRECIO,
      FAQ_REGISTRO,
      FAQ_PRIVACIDAD,
    ],
  },
  {
    slug: 'ganar-dinero-chat',
    label: 'Ganar dinero chat',
    h1: 'Ganar dinero con un chat',
    metaTitle: mt('Ganar dinero chat', 'ganarDinero'),
    metaDescription:
      'Cómo ganar dinero con un chat privado. Recibe propinas en tiempo real de tu audiencia. Sala gratis en tiptalk.chat.',
    intro:
      'Para **ganar dinero con un chat**, lo primero es tener algo que ofrecer. Lo segundo, una herramienta sin fricciones para cobrar. Eso es tiptalk.chat.',
    paragraphs: [
      'Si lo que se te da bien es hablar — escuchar, dar consejo, animar, contar — un chat privado puede ser una vía sencilla de **ganar dinero**. tiptalk.chat lo monta para ti: la sala, el sistema de propinas y la conversión a euros.',
      'Tú abres tu sala, le compartes el enlace a quien te sigue (Instagram, Twitter, TikTok, lo que uses) y cada persona que entra puede dejarte propinas. No tienes que cumplir horario ni quedarte conectado todo el día.',
      'Abres la sala cuando puedes, atiendes a quien entra y cobras lo que se haya juntado. Esto da una flexibilidad enorme: si solo tienes una hora al día, esa hora puede ser productiva sin estar atado a un calendario fijo.',
      'Para **ganar dinero chateando** de forma sostenida, hay tres claves: una audiencia que te conozca, un horario más o menos previsible (aunque sea informal) y un canal para promocionar tu sala cuando vayas a estar dentro.',
      'La comisión de la plataforma es del 30% sobre las propinas. Eso significa que si recibes 100 € en una semana, retiras 70 €. Suena alto comparado con un trabajo tradicional, pero comparado con apps de creadores grandes (que cobran 50-60% en muchos casos) es competitivo.',
      'Hay perfiles muy distintos que ganan dinero en tiptalk.chat: terapeutas que hacen consultas cortas, coaches deportivos que dan asesoría, profesores de idiomas en sesiones rápidas, gente que simplemente sabe escuchar y la gente paga por hablar con ellos.',
      'El **ganar dinero chat** no se hace de un día para otro. Pero como crear la sala no cuesta y no hay riesgo financiero, puedes probarlo en paralelo a lo que ya haces. Si funciona, escalas. Si no, no pierdes nada.',
    ],
    faqs: [
      {
        q: '¿Realmente se puede ganar dinero con un chat?',
        a: 'Sí, si tienes algo que ofrecer (conocimiento, empatía, entretenimiento) y una audiencia. No es dinero fácil ni rápido, pero es un canal real para quien ya tiene seguidores en otras redes.',
      },
      {
        q: '¿Cuánto se gana de media con un chat de propinas?',
        a: 'Depende totalmente del tamaño de la audiencia y de la regularidad. Hay quien saca 20-50 € a la semana de propinas pequeñas, y quien con audiencias grandes saca cientos al día. No hay garantías.',
      },
      FAQ_PROPINAS,
      FAQ_PRECIO,
      FAQ_REGISTRO,
    ],
  },
  {
    slug: 'gana-dinero-chateando',
    label: 'Gana dinero chateando',
    h1: 'Gana dinero chateando',
    metaTitle: mt('Gana dinero chateando', 'ganarDineroIng'),
    metaDescription:
      'Gana dinero chateando con tu audiencia. Propinas en directo, sin pasarelas. Crea tu sala en tiptalk.chat y empieza hoy.',
    intro:
      '**Gana dinero chateando** sin montar una empresa, sin gestionar pagos uno a uno. Sala lista, propinas integradas, retiradas mensuales.',
    paragraphs: [
      'Para **ganar dinero chateando** no necesitas montar una empresa ni gestionar pagos uno a uno. tiptalk.chat te da la sala, el sistema de propinas y la conversión a euros para que cobres.',
      'La economía es simple: tu audiencia compra Tipsys (1€ = 8 Tipsys), te los mandan dentro del chat y tú los retiras cuando llegas al mínimo (300 Tipsys = 30 €). No hay etapas intermedias ni cobros pendientes que se atascan.',
      'Si ya tienes seguidores, lo que estás haciendo es ofrecerles un canal directo donde apoyarte sin pasar por suscripciones complicadas. Es un escalón intermedio entre "follow gratis" y "Patreon recurrente".',
      'Para audiencias pequeñas o medianas funciona porque el coste de entrada para el seguidor es bajo: 25 céntimos por una propina pequeña, sin compromiso de mensualidad. Eso baja la barrera psicológica que tienen otros modelos.',
      '**Gana dinero chateando** en horarios que elijas tú. La sala se abre cuando quieres y se cierra cuando terminas. No hay compromisos de "atender 24/7" ni horarios fijos publicitados.',
      'Hay gente que combina tiptalk.chat con otras fuentes de ingreso. Por ejemplo: un creador que tiene OnlyFans para contenido grabado, y abre tiptalk.chat para sesiones en directo donde el seguidor paga por hablar contigo en persona. Son mercados distintos pero compatibles.',
      'No promocionamos un "hazte rico con un chat". Es una herramienta para convertir tiempo de conversación en ingresos cuando tienes una audiencia que te lo quiere pagar. El éxito depende de ti, no de la plataforma.',
    ],
    faqs: [
      {
        q: '¿Necesito tener seguidores para ganar dinero chateando?',
        a: 'Lo ideal es tener un canal donde promocionar tu sala — Instagram, Twitter, TikTok, una newsletter. Sin una audiencia mínima es difícil que entren a tu sala. La herramienta no genera tráfico por sí sola.',
      },
      {
        q: '¿Cuándo me pagan las propinas que recibo?',
        a: 'Las propinas entran en tu monedero al instante. Para retirarlas a tu cuenta bancaria necesitas llegar al mínimo (300 Tipsys / 30 €) y solicitar el cobro. Llega en 1-2 días laborables.',
      },
      FAQ_PROPINAS,
      FAQ_PRECIO,
      FAQ_REGISTRO,
    ],
  },
  {
    slug: 'chat-espanol-gratis',
    label: 'Chat español gratis',
    h1: 'Chat en español gratis',
    metaTitle: mt('Chat español gratis', 'salas'),
    metaDescription:
      'Chat en español, totalmente gratis. Sin registro, sin instalar, con vídeo y voz. Crea tu sala privada en tiptalk.chat.',
    intro:
      '**Chat español gratis** de verdad: ni email, ni tarjeta, ni "primera semana gratis y luego pagas".',
    paragraphs: [
      'Esto es lo que prometemos: **chat en español gratis**, sin pagar nada, sin dar tu email. Pones un nick y ya estás dentro.',
      'La interfaz es directa: una caja para escribir, un botón para subir foto o vídeo, dos para empezar llamada de voz o vídeo. No te marea con menús, no hay un asistente preguntándote cosas para vender mejor.',
      'Si después quieres una cuenta para que tu sala te asocie a ti, te registras en un minuto. Si no, sigues como invitado todo lo que quieras. El **chat español gratis** funciona exactamente igual con cuenta y sin cuenta para el uso básico.',
      'A diferencia de otras webs de "chat español gratis" donde acabas en un foro con anuncios pop-up por todas partes, aquí no hay publicidad. La interfaz está limpia porque el modelo de negocio es la comisión sobre propinas, no los anuncios.',
      'Las llamadas en **chat español gratis** son ilimitadas. Puedes estar hablando una hora, dos horas, lo que aguante tu conexión. No hay créditos que se gastan ni minutos contados.',
      'Lo único que pasa al cabo de 24 horas es que la sala se cierra sola y se borra todo. Es por privacidad — no por una restricción de "versión gratis". Si quieres seguir hablando, abres otra sala con el mismo nombre, compartes el nuevo enlace y listo.',
      'Para uso ocasional o uso intensivo, es lo mismo. No subes a un plan premium nunca: la herramienta es la que ves desde el primer momento.',
    ],
    faqs: [
      {
        q: '¿El chat español gratis tiene anuncios?',
        a: 'No. La interfaz no muestra publicidad dentro de las salas. El negocio se sostiene por la comisión sobre las propinas que se mandan.',
      },
      {
        q: '¿Cuál es el límite del plan gratis?',
        a: 'No hay plan gratis ni plan de pago, solo hay un plan. Las salas son gratis y se cierran a las 24 horas o cuando el creador quiera, no por una limitación de pago.',
      },
      FAQ_PRECIO,
      FAQ_REGISTRO,
      FAQ_PRIVACIDAD,
    ],
  },
  {
    slug: 'chat-espanol-free',
    label: 'Chat español free',
    h1: 'Chat español free',
    metaTitle: mt('Chat español free', 'chatPrivado'),
    metaDescription:
      'Free Spanish chat — sin coste, sin registro. Sala privada con voz y vídeo desde el navegador. Pensado para hispanohablantes.',
    intro:
      '**Chat español free** — gratis, en castellano, con vídeo y propinas en el mismo sitio.',
    paragraphs: [
      'Para quien busca un **chat en español "free"** — es decir, totalmente gratis y sin barreras — tiptalk.chat es probablemente el camino más corto. Lo abres, lo usas, no te piden nada.',
      'No hay periodo de prueba ni planes premium escondidos. La parte de chatear y llamar es **free** siempre. No vamos a sacar dentro de seis meses un "plan pro" que limite lo que ahora puedes hacer.',
      'Lo único que cuesta dinero son las propinas, porque por definición son dinero. Pero eso es opcional y solo para quien quiera mandarlas. La conversación principal sigue siendo **free**.',
      'A nivel de funcionalidades, el **chat español free** de tiptalk.chat incluye todo lo que esperarías: mensajes ilimitados, fotos, vídeos cortos, llamadas de voz, videollamadas, opción de propinas. No hay versión recortada para usuarios gratis.',
      'Esto contrasta con otras plataformas de chat que han ido recortando lo que se puede hacer "gratis" para empujar a planes de pago. Aquí no: lo que funciona ahora va a seguir funcionando, y se añaden cosas sin quitar las básicas.',
      'Si comparas tiptalk.chat con apps de mensajería tradicionales (WhatsApp, Telegram), la diferencia clave es que aquí la sala es efímera y no requiere intercambio de números. **Free** no solo de coste, sino de fricción.',
      'Una nota cultural: el término "free" lo usamos aquí porque mucha gente busca el chat español sin la palabra "gratis", y queremos que nos encuentren igual. La experiencia es la misma uses la palabra que uses.',
    ],
    faqs: [
      {
        q: '¿Free Spanish chat significa que es completamente gratis?',
        a: 'Sí. Crear sala, chatear, llamar y enviar fotos es todo free. Solo las propinas, que son transferencias de dinero real, tienen coste para quien las manda.',
      },
      {
        q: '¿Va a haber un plan de pago en el futuro?',
        a: 'No tenemos planes de añadir un tier de pago. El modelo de negocio es la comisión sobre propinas y eso es suficiente para mantener la herramienta sin tener que cobrar a usuarios básicos.',
      },
      FAQ_PRECIO,
      FAQ_REGISTRO,
      FAQ_NAVEGADOR,
    ],
  },
  {
    slug: 'chat-espanol-sin-registro',
    label: 'Chat español sin registro',
    h1: 'Chat en español sin registro',
    metaTitle: mt('Chat español sin registro', 'salas'),
    metaDescription:
      'Chat en español sin registro. Crea sala, comparte enlace y chatea. No piden cuenta, no piden teléfono.',
    intro:
      '**Chat español sin registro**: pones un nick, abres la sala, compartes el enlace. Nada más.',
    paragraphs: [
      'Una de las cosas que pedíais era no tener que registrarse para nada. Hecho: cualquiera puede abrir una sala con solo un nick. tiptalk.chat es probablemente el **chat español sin registro** más directo que vas a encontrar.',
      'Lo único que se guarda es ese nick — no email, no teléfono, no nombre real. Y desaparece junto con la sala cuando se cierra. No hay base de datos con tus datos esperando para hacerse pública algún día.',
      'Si más tarde quieres recibir propinas, ahí sí tienes que registrar una cuenta. Pero para chatear y llamar, basta con un nombre. Esto es importante: el **chat español sin registro** es real para el flujo principal, no un señuelo que te lleva a un signup forzado.',
      'El motivo por el que muchas plataformas obligan a registrarse es para construir un perfil del usuario y monetizarlo (vendiendo datos, anuncios segmentados, etc.). tiptalk.chat no necesita eso porque cobra una comisión sobre propinas — no le hace falta saber quién eres para ganarse la vida.',
      'Si solo vas a usar el **chat español sin registro** una vez puntual — una llamada con alguien, una conversación rápida — no tiene sentido dar tus datos. La idea es entrar, hablar y salir, igual que cuando entras a una librería: no hace falta presentarse.',
      'Cuando entras como invitado a una sala que alguien te ha compartido, tampoco te piden registrarse. Solo el nick. Esto es importante para quien organiza la sala: puede invitar a gente sin obligarles a apuntarse, lo que reduce la fricción al mínimo.',
      'Para casos donde sí prefieres tener cuenta — por ejemplo, recibir propinas o que tu nombre aparezca consistente — el registro es opcional. Pero nunca obligatorio para el uso básico del **chat español sin registro**.',
    ],
    faqs: [
      {
        q: '¿Es realmente posible usar el chat sin registrarse?',
        a: 'Sí, sin trampas. Puedes abrir una sala con solo un nick y un nombre de sala. Quien entra desde tu enlace tampoco necesita registrarse: pone su nick y entra como invitado.',
      },
      {
        q: '¿Qué pierdo si uso el chat sin registro?',
        a: 'Sin registro no puedes recibir propinas (eso requiere conectar una cuenta de cobros) y no podemos asociar las salas a ti entre sesiones. Para todo lo demás (chatear, llamar, mandar fotos) no pierdes nada.',
      },
      FAQ_PRIVACIDAD,
      FAQ_PRECIO,
      FAQ_MOVIL,
    ],
  },
];

// === COLUMNS 3 & 4: Países ==============================================
interface CountryEntry {
  slug: string;
  label: string;
  display: string;
  /** Continent for the body copy */
  region: 'Europa' | 'Norteamérica' | 'Centroamérica' | 'Sudamérica' | 'Caribe';
  /** Optional capital / city note for variety */
  city?: string;
}

const countriesRaw: CountryEntry[] = [
  { slug: 'chat-argentina', label: 'Chat Argentina', display: 'Argentina', region: 'Sudamérica', city: 'Buenos Aires' },
  { slug: 'chat-brasil', label: 'Chat Brasil', display: 'Brasil', region: 'Sudamérica' },
  { slug: 'chat-bogota', label: 'Chat Bogotá', display: 'Bogotá', region: 'Sudamérica' },
  { slug: 'chat-bolivia', label: 'Chat Bolivia', display: 'Bolivia', region: 'Sudamérica', city: 'La Paz' },
  { slug: 'chat-buenos-aires', label: 'Chat Buenos Aires', display: 'Buenos Aires', region: 'Sudamérica' },
  { slug: 'chat-chile', label: 'Chat Chile', display: 'Chile', region: 'Sudamérica', city: 'Santiago' },
  { slug: 'chat-colombia', label: 'Chat Colombia', display: 'Colombia', region: 'Sudamérica', city: 'Bogotá' },
  { slug: 'chat-costa-rica', label: 'Chat Costa Rica', display: 'Costa Rica', region: 'Centroamérica' },
  { slug: 'chat-cuba', label: 'Chat Cuba', display: 'Cuba', region: 'Caribe', city: 'La Habana' },
  { slug: 'chat-ecuador', label: 'Chat Ecuador', display: 'Ecuador', region: 'Sudamérica', city: 'Quito' },
  { slug: 'chat-el-salvador', label: 'Chat El Salvador', display: 'El Salvador', region: 'Centroamérica' },
  { slug: 'chat-espana-pais', label: 'Chat España (país)', display: 'España', region: 'Europa', city: 'Madrid' },
  { slug: 'chat-guatemala', label: 'Chat Guatemala', display: 'Guatemala', region: 'Centroamérica' },
  { slug: 'chat-honduras', label: 'Chat Honduras', display: 'Honduras', region: 'Centroamérica' },
  { slug: 'chat-mexico', label: 'Chat México', display: 'México', region: 'Norteamérica', city: 'CDMX' },
  { slug: 'chat-nicaragua', label: 'Chat Nicaragua', display: 'Nicaragua', region: 'Centroamérica' },
  { slug: 'chat-republica-dominicana', label: 'Chat República Dominicana', display: 'República Dominicana', region: 'Caribe' },
  { slug: 'chat-peru', label: 'Chat Perú', display: 'Perú', region: 'Sudamérica', city: 'Lima' },
  { slug: 'chat-panama', label: 'Chat Panamá', display: 'Panamá', region: 'Centroamérica' },
  { slug: 'chat-paraguay', label: 'Chat Paraguay', display: 'Paraguay', region: 'Sudamérica', city: 'Asunción' },
  { slug: 'chat-puerto-rico', label: 'Chat Puerto Rico', display: 'Puerto Rico', region: 'Caribe' },
  { slug: 'chat-tijuana', label: 'Chat Tijuana', display: 'Tijuana', region: 'Norteamérica' },
  { slug: 'chat-uruguay', label: 'Chat Uruguay', display: 'Uruguay', region: 'Sudamérica', city: 'Montevideo' },
  { slug: 'chat-venezuela', label: 'Chat Venezuela', display: 'Venezuela', region: 'Sudamérica', city: 'Caracas' },
];

const titleSuffixes: (keyof typeof T)[] = ['ganarDinero', 'salas', 'chatPrivado', 'ganarDineroIng'];

const countries: SeoPage[] = countriesRaw.map((c, i) => ({
  slug: c.slug,
  label: c.label,
  h1: `Chat para ${c.display}`,
  metaTitle: mt(c.label, titleSuffixes[i % titleSuffixes.length]!),
  metaDescription: `Sala de chat privada para ${c.display}. Texto, voz, vídeo y propinas desde el navegador. Sin registro. Crea tu sala en tiptalk.chat.`,
  intro: `**Chat ${c.display}** sin descargas, en español y con propinas integradas. La sala se abre desde el navegador, da igual el dispositivo.`,
  paragraphs: [
    `Si estás en ${c.display} o quieres una sala de **chat ${c.display}** con gente de allí, tiptalk.chat funciona igual de bien. La sala se crea desde el navegador en cualquier dispositivo: portátil, tablet o móvil.`,
    `Como cada sala se comparte por enlace, vale tanto para charlar con alguien en la misma ciudad como con alguien que está al otro lado. La latencia se mantiene baja porque elegimos el servidor de llamada más cercano a quien se conecta — algo importante para una región como ${c.region}.`,
    c.city
      ? `Para quien está en ${c.city} u otras ciudades de ${c.display}, la experiencia de chat es la misma que desde cualquier otra parte del país. No hace falta una conexión especialmente buena: el sistema baja la calidad del vídeo si la red flojea, manteniendo la voz clara.`
      : `Para quien está en distintas ciudades de ${c.display}, la experiencia es uniforme. No hace falta una conexión especialmente buena: el sistema baja la calidad del vídeo si la red flojea, manteniendo la voz clara.`,
    `Si recibes propinas en un **chat ${c.display}**, los Tipsys se acumulan en tu monedero y los retiras a tu cuenta cuando quieras. Vale para creadores, profesionales y para cualquiera que quiera cobrar por su tiempo de conversación. La retirada llega a cuentas internacionales que soporten transferencias en euros.`,
    `Para uso particular — una llamada con familia que vive en ${c.display}, una clase con alguien que conociste online, una charla larga — el **chat ${c.display}** es lo más cómodo: no obliga a la otra persona a instalar nada. Solo el enlace.`,
    `Las conversaciones en el **chat ${c.display}** no se almacenan más allá de las 24 horas. Cuando cierras la sala (o cuando expira automáticamente), todo lo que se mandó dentro se borra. Eso incluye fotos, vídeos, mensajes y archivos.`,
    `Como el servicio es web y no app, no hay versiones que actualizar ni problemas de compatibilidad. Si tu navegador funciona, el **chat ${c.display}** funciona. Y todos los navegadores modernos (Chrome, Safari, Firefox, Edge) son compatibles.`,
  ],
  faqs: [
    {
      q: `¿El chat ${c.display} funciona bien con conexiones móviles?`,
      a: `Sí. El sistema adapta la calidad del vídeo a la red disponible. Con 4G normal en ${c.display} se mantiene una videollamada estable. Si la conexión es débil, la voz sigue funcionando aunque baje el vídeo.`,
    },
    {
      q: `¿Puedo recibir propinas en mi chat si vivo en ${c.display}?`,
      a: `Sí, siempre que tengas una cuenta bancaria que acepte transferencias internacionales o una cuenta en un país que Stripe Connect soporte. La mayoría de países de habla hispana están cubiertos.`,
    },
    FAQ_REGISTRO,
    FAQ_PRECIO,
    FAQ_PRIVACIDAD,
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
  { title: 'Chat', titleKey: 'footer.seo.chat', slugs: features.map((p) => p.slug) },
  { title: 'En español', titleKey: 'footer.seo.spanish', slugs: spanish.map((p) => p.slug) },
  {
    title: 'Países (A-M)',
    titleKey: 'footer.seo.countriesAM',
    slugs: countriesRaw.slice(0, 12).map((c) => c.slug),
  },
  {
    title: 'Países (N-V)',
    titleKey: 'footer.seo.countriesNV',
    slugs: countriesRaw.slice(12).map((c) => c.slug),
  },
];
