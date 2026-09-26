import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  MapPin,
  Coins,
  Lock,
  Wallet,
  Smartphone,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { spainProvinces } from '@/lib/seo-pages';

export const metadata: Metadata = {
  title: 'Chat España - Chat gratis con propinas por provincias',
  description:
    'Chat España gratis y privado con propinas en directo. Habla por texto, voz o vídeo y empieza a ganar dinero chateando. Entra en el chat de tu provincia: Madrid, Barcelona, Valencia, Sevilla y todas las demás.',
  alternates: { canonical: 'https://www.tiptalk.chat/c/chat-espana' },
};

const provinces = [...spainProvinces].sort((a, b) =>
  a.display.localeCompare(b.display, 'es'),
);

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: '¿El chat España es gratis?',
    a: 'Sí. Crear tu sala y chatear es gratis y sin registro. Solo las propinas (tips) mueven dinero real, porque van directas de una persona a otra.',
  },
  {
    q: '¿Cómo gano dinero chateando en España?',
    a: 'Cuando alguien valora tu tiempo te envía Tipsys, que se acumulan en tu monedero. Los conviertes a euros y los retiras a tu cuenta cuando quieras.',
  },
  {
    q: '¿Necesito instalar una app?',
    a: 'No. El chat se abre en el navegador del móvil o del ordenador (Chrome, Safari, Firefox, Edge). La otra persona solo necesita tu enlace.',
  },
  {
    q: '¿Es privado?',
    a: 'Sí. La sala es uno a uno y, al cerrarla o pasadas 24 horas, se borra todo: mensajes, fotos y vídeos. No guardamos grabaciones.',
  },
];

export default function ChatEspanaPage(): React.ReactElement {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <SiteHeader />

      {/* ===== HERO (banda centrada a todo el ancho) ===== */}
      <section className="relative overflow-hidden border-b border-surface-container bg-gradient-to-b from-primary-50/70 to-canvas">
        <div className="absolute left-1/2 top-0 -z-10 h-72 w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,92,0,0.16),transparent_70%)]" />
        <div className="mx-auto max-w-3xl px-6 py-20 text-center sm:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-surface-container bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-ink-muted">
            <MapPin className="h-3.5 w-3.5 text-primary-500" /> Cobertura en toda España
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            Chat <span className="bg-gradient-to-r from-secondary-500 to-primary-500 bg-clip-text text-transparent">España</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
            Un chat gratis, privado y con propinas en directo. Abre tu sala, habla por texto, voz o
            vídeo y empieza a ganar dinero chateando desde cualquier provincia.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/create"
              className="btn-tactile inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-8 py-3.5 text-base font-bold text-white shadow-vivid transition hover:shadow-vivid-strong"
            >
              Crear sala gratis <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="#provincias"
              className="inline-flex items-center gap-2 rounded-full border border-surface-container bg-white px-6 py-3.5 text-base font-semibold text-ink transition hover:bg-surface-soft"
            >
              Ver provincias
            </a>
          </div>
        </div>
      </section>

      {/* ===== INTRO en prosa (una sola columna, estilo distinto a cards) ===== */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="prose-tiptalk space-y-5 text-lg leading-relaxed text-ink-muted">
          <p>
            En <strong className="text-ink">tiptalk.chat</strong> tienes un <strong className="text-ink">chat en España</strong> que
            funciona igual de bien en Madrid, en un pueblo de Soria o desde la playa en Cádiz. La sala
            se crea en segundos desde el navegador y se comparte con un simple enlace: nada de apps,
            nada de números de teléfono.
          </p>
          <p>
            Lo que lo hace distinto es que es un <strong className="text-ink">chat con propinas</strong>. Si la gente valora tu
            conversación, te envía Tipsys que se acumulan en tu monedero, y los conviertes a euros
            cuando quieras. Es la manera más directa de <strong className="text-ink">ganar dinero chateando</strong> sin montar
            una web ni depender del alcance de una red social.
          </p>
          <p>
            Y sigue siendo privado de verdad: al cerrar la sala, o pasadas 24 horas, se borra todo. No
            guardamos grabaciones de tus conversaciones.
          </p>
        </div>
      </section>

      {/* ===== FILAS ALTERNAS (imagen/texto) ===== */}
      <section className="border-y border-surface-container bg-white/60">
        <div className="mx-auto max-w-6xl space-y-16 px-6 py-20">
          {/* Fila 1 */}
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
                Texto, voz y vídeo en HD
              </h2>
              <p className="mt-3 text-lg leading-relaxed text-ink-muted">
                Empieza escribiendo y salta a una llamada de voz o una videollamada con un botón. La
                calidad se adapta a tu conexión, así que aguanta bien incluso con datos móviles.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-ink-muted">
                {['Sin descargas ni instalaciones', 'Funciona en móvil y ordenador', 'Un enlace y listo'].map((x) => (
                  <li key={x} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" /> {x}
                  </li>
                ))}
              </ul>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/chat-espana.jpg"
              alt="Chica chateando en el móvil en un chat gratis con propinas en España"
              width={1000}
              height={667}
              className="h-56 w-full rounded-3xl object-cover object-[center_28%]"
            />
          </div>
          {/* Fila 2 (invertida) */}
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="order-2 grid h-56 place-items-center rounded-3xl border border-surface-container bg-gradient-to-br from-amber-100 to-primary-50 md:order-1">
              <Coins className="h-16 w-16 text-amber-500" />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
                Propinas que se convierten en euros
              </h2>
              <p className="mt-3 text-lg leading-relaxed text-ink-muted">
                Recibe Tipsys mientras hablas. Se acumulan en tu monedero y los retiras a tu cuenta
                cuando quieras. Abrir salas y chatear es gratis; solo las propinas mueven dinero real.
              </p>
              <Link
                href="/ganar-dinero-online-chateando"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-500"
              >
                Cómo ganar dinero chateando <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROVINCIAS (la rejilla con las 50) ===== */}
      <section id="provincias" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Chat por provincias
          </h2>
          <p className="mt-3 text-lg text-ink-muted">
            Entra en el chat de tu provincia. Cada una tiene su propia sala: elige la tuya y empieza a
            hablar.
          </p>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm sm:grid-cols-3 lg:grid-cols-4">
          {provinces.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/c/${p.slug}`}
                className="flex items-center gap-2 rounded-lg px-2 py-2 text-ink-muted transition hover:bg-surface-soft hover:text-primary-600"
              >
                <MapPin className="h-3.5 w-3.5 shrink-0 text-primary-400" />
                <span>Chat {p.display}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ===== TIRA DE VENTAJAS (iconos) ===== */}
      <section className="border-y border-surface-container bg-surface-soft/40">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-14 md:grid-cols-4">
          {[
            { icon: <Wallet className="h-6 w-6" />, t: 'Retiradas en euros' },
            { icon: <Lock className="h-6 w-6" />, t: 'Privacidad real' },
            { icon: <Smartphone className="h-6 w-6" />, t: 'Sin apps' },
            { icon: <ShieldCheck className="h-6 w-6" />, t: 'Gratis para empezar' },
          ].map((f) => (
            <div key={f.t} className="flex flex-col items-center gap-2 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-primary-500 shadow-soft">
                {f.icon}
              </span>
              <p className="text-sm font-semibold text-ink">{f.t}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FAQ (2 columnas, distinto al acordeón de ganar-dinero) ===== */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-center font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Preguntas frecuentes
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {FAQS.map((f) => (
            <div key={f.q} className="rounded-2xl border border-surface-container bg-white p-6 shadow-soft">
              <h3 className="font-display text-base font-bold text-ink">{f.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-3xl border border-surface-container bg-white px-8 py-14 text-center shadow-vivid sm:px-16">
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Tu chat en España, listo en segundos
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-lg text-ink-muted">
            Crea tu sala gratis, comparte el enlace y empieza a chatear —y a recibir propinas— hoy mismo.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/create"
              className="btn-tactile inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-8 py-3.5 text-base font-bold text-white shadow-vivid transition hover:shadow-vivid-strong"
            >
              Crear sala gratis <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </div>
  );
}
